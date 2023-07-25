import { Sub, Event } from "nostr-tools";
import { useParams } from "solid-start";
import { RelayContext } from "~/contexts/relay";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { IUserMetadata } from "~/interfaces/IUserMetadata";
import LoadingFallback from "~/components/feed/LoadingFallback";
import { JSX, Show, VoidComponent, createSignal, onMount, useContext } from "solid-js";
import EventWrapper from "~/components/feed/EventWrapper";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import { createMetadataFilter } from "~/lib/nostr/nostr-utils";

const EventByID: VoidComponent = (): JSX.Element => {
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [nostrEvent, setNostrEvent] = createSignal<IEnrichedEvent | undefined>();

  onMount(() => {
    setIsLoading(true);
    const params = useParams<{ id: string }>();

    const relay = useContext(RelayContext);
    const sub: Sub = relay.sub([{ ids: [params.id] }]);

    sub.on("event", (evt: Event) => {
      setNostrEvent({ ...evt, name: "", about: "", picture: "" });
    });

    sub.on("eose", () => {
      const metadataSub: Sub = relay.sub([createMetadataFilter([nostrEvent()!.pubkey])]);

      metadataSub.on("event", (metaEvent: Event) => {
        const metadata: IUserMetadata = JSON.parse(metaEvent.content);

        setNostrEvent({
          ...nostrEvent()!,
          name: metadata.name,
          about: metadata.about,
          picture: metadata.picture
        });

        setIsLoading(false);

        metadataSub.on("eose", () => {
          metadataSub.unsub();
        })
      });

      sub.unsub();
    });
  });

  return (
    <>
      <Show when={!isLoading() && useIsNarrow() !== undefined} fallback={<LoadingFallback />}>
        <EventWrapper event={{ ...nostrEvent()! }} isNarrow={false} />
      </Show>
    </>
  );
};

export default EventByID;
