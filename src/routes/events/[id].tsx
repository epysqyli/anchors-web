import { useParams } from "solid-start";
import { Sub, Event, Kind } from "nostr-tools";
import { RelayContext } from "~/contexts/relay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { IUserMetadata } from "~/interfaces/IUserMetadata";
import EventWrapper from "~/components/feed/EventWrapper";
import { createMetadataFilter } from "~/lib/nostr/nostr-utils";
import LoadingFallback from "~/components/feed/LoadingFallback";
import { JSX, Show, VoidComponent, createSignal, onMount, useContext } from "solid-js";

const EventByID: VoidComponent = (): JSX.Element => {
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [nostrEvent, setNostrEvent] = createSignal<Event | undefined>();
  const [enrichedEvent, setEnrichedEvent] = createSignal<IEnrichedEvent>();
  const [userMetadata, setUserMetadata] = createSignal<IUserMetadata>({ about: "", name: "", picture: "" });
  const [reactions, setReactions] = createSignal<{ positive: number; negative: number }>({
    positive: 0,
    negative: 0
  });

  onMount(() => {
    setIsLoading(true);
    const params = useParams<{ id: string }>();

    const relay = useContext(RelayContext);
    const sub: Sub = relay.sub([{ ids: [params.id] }]);

    sub.on("event", (evt: Event) => {
      setNostrEvent(evt);
    });

    sub.on("eose", () => {
      const metadataSub: Sub = relay.sub([createMetadataFilter([nostrEvent()!.pubkey])]);

      metadataSub.on("event", (metaEvent: Event) => {
        const metadata: IUserMetadata = JSON.parse(metaEvent.content);
        setUserMetadata(metadata);

        metadataSub.on("eose", () => {
          metadataSub.unsub();
        });
      });

      const reactionsSub: Sub = relay.sub([{ kinds: [Kind.Reaction], "#e": [params.id] }]);
      let positive = 0;
      let negative = 0;

      reactionsSub.on("event", (evt: Event) => {
        switch (evt.content) {
          case "+":
            positive++;
            break;

          case "-":
            negative++;
            break;

          default:
            break;
        }
      });

      reactionsSub.on("eose", () => {
        setReactions({ positive: positive, negative: negative });
        setEnrichedEvent({ ...nostrEvent()!, ...userMetadata(), ...reactions() });
        reactionsSub.unsub();

        setIsLoading(false);
      });

      sub.unsub();
    });
  });

  return (
    <>
      <Show
        when={!isLoading() && useIsNarrow() !== undefined && enrichedEvent() !== undefined}
        fallback={<LoadingFallback />}
      >
        <EventWrapper event={enrichedEvent()!} isNarrow={false} />
      </Show>
    </>
  );
};

export default EventByID;
