import { useParams } from "solid-start";
import { RelayContext } from "~/contexts/relay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import EventWrapper from "~/components/feed/EventWrapper";
import { fetchEvents } from "~/lib/nostr/nostr-nips-actions";
import LoadingFallback from "~/components/feed/LoadingFallback";
import { JSX, Show, VoidComponent, createSignal, onMount, useContext } from "solid-js";

const EventByID: VoidComponent = (): JSX.Element => {
  const [events, setEvents] = createSignal<IEnrichedEvent[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  onMount(() => {
    const params = useParams<{ id: string }>();
    const { relay } = useContext(RelayContext);

    fetchEvents(relay, setEvents, setIsLoading, { ids: [params.id] });
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
