import { Kind } from "nostr-tools";
import { useParams } from "solid-start";
import { RelayContext } from "~/contexts/relay";
import OverlayContext from "~/contexts/overlay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import EventWrapper from "~/components/feed/EventWrapper";
import LoadingFallback from "~/components/feed/LoadingFallback";
import { For, JSX, Show, VoidComponent, createSignal, onMount, useContext } from "solid-js";

const RefUrl: VoidComponent = (): JSX.Element => {
  const overlay = useContext(OverlayContext);
  const { relay, isAnchorsMode } = useContext(RelayContext);

  const [events, setEvents] = createSignal<IEnrichedEvent[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [eventWrapperContainer, setEventWrapperContainer] = createSignal<HTMLDivElement>();

  const fetchAndSetEvents = async (): Promise<void> => {
    const params = useParams<{ refUrl: string }>();

    const events = await relay.fetchTextEvents({
      rootOnly: true,
      isAnchorsMode: isAnchorsMode(),
      filter: { "#r": [params.refUrl] }
    });

    const metadata = await relay.fetchEventsMetadata({ authors: events.map((evt) => evt.pubkey) });
    const reactions = await relay.fetchEventsReactions([
      { kinds: [Kind.Reaction], "#e": events.map((evt) => evt.id) }
    ]);

    setEvents(relay.buildEnrichedEvents(events, metadata, reactions));
  };

  onMount(async () => {
    setIsLoading(true);
    await fetchAndSetEvents();
    setIsLoading(false);
  });

  // dry up
  const eventWrapperContainerStyle = (): string => {
    if (!overlay.showOverlay()) {
      return "custom-scrollbar snap-y snap-mandatory overflow-x-hidden h-full";
    }

    return "custom-scrollbar snap-y snap-mandatory overflow-hidden h-full";
  };

  // dry up
  const scrollPage = (direction: "up" | "down"): void => {
    eventWrapperContainer()!.scrollBy({
      behavior: "smooth",
      top: direction == "up" ? -1000 : 1000
    });
  };

  // show no events div when no events are found
  return (
    <>
      <Show
        when={!isLoading() && useIsNarrow() !== undefined && !useIsNarrow() && events().length > 0}
        fallback={<LoadingFallback />}
      >
        <div class='relative h-full animate-scale-on-load'>
          <div class={eventWrapperContainerStyle()} ref={(el) => setEventWrapperContainer(el)}>
            <For each={events()}>
              {(nostrEvent) => <EventWrapper event={nostrEvent} scrollPage={scrollPage} />}
            </For>
          </div>
        </div>
      </Show>
    </>
  );
};

export default RefUrl;
