import { Kind } from "nostr-tools";
import { useParams } from "solid-start";
import { RelayContext } from "~/contexts/relay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import EventWrapper from "~/components/feed/EventWrapper";
import LoadingFallback from "~/components/feed/LoadingFallback";
import { JSX, Show, VoidComponent, createSignal, onMount, useContext } from "solid-js";

const EventByID: VoidComponent = (): JSX.Element => {
  const { relay, isAnchorsMode } = useContext(RelayContext);

  const [events, setEvents] = createSignal<IEnrichedEvent[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  onMount(async () => {
    setIsLoading(true);
    const params = useParams<{ id: string }>();

    const events = await relay.fetchTextEvents(
      { ids: [params.id] },
      { rootOnly: true, isAnchorsMode: isAnchorsMode() }
    );

    const metadata = await relay.fetchEventsMetadata({ authors: events.map((evt) => evt.pubkey) });
    const reactions = await relay.fetchEventsReactions([
      { kinds: [Kind.Reaction], "#e": events.map((evt) => evt.id) }
    ]);

    setEvents(relay.buildEnrichedEvents(events, metadata, reactions));
    setIsLoading(false);
  });

  return (
    <>
      <Show
        when={!isLoading() && useIsNarrow() !== undefined && !useIsNarrow() && events().length > 0}
        fallback={<LoadingFallback />}
      >
        <EventWrapper event={events()[0]} />
      </Show>
    </>
  );
};

export default EventByID;
