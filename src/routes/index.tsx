import { useLocation } from "solid-start";
import { RelayContext } from "~/contexts/relay";
import { Event, Filter, Kind } from "nostr-tools";
import { IReaction } from "~/interfaces/IReaction";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import EventWrapper from "~/components/feed/EventWrapper";
import NewEventsPopup from "~/components/feed/NewEventsPopup";
import LoadingFallback from "~/components/feed/LoadingFallback";
import { IUserMetadataWithPubkey } from "~/interfaces/IUserMetadata";
import { Component, For, Show, createSignal, onMount, useContext } from "solid-js";

interface EventHtmlRef {
  htmlRef: HTMLDivElement;
  eventID: string;
  createdAt: number;
}

const Home: Component<{}> = () => {
  const { relay } = useContext(RelayContext);

  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [showPopup, setShowPopup] = createSignal<boolean>(false);
  const [eventHtmlRefs, setEventHtmlRefs] = createSignal<EventHtmlRef[]>([]);
  const [eventWrapperContainer, setEventWrapperContainer] = createSignal<HTMLDivElement>();

  const [events, setEvents] = createSignal<Event[]>([]);
  const [metaEvents, setMetaEvents] = createSignal<IUserMetadataWithPubkey[]>([]);
  const [enrichedEvents, setEnrichedEvents] = createSignal<IEnrichedEvent[]>([], { equals: false });

  /**
   * manage live updates after having first fetch
   * how to setup have a caching layer
   */
  onMount(async () => {
    setIsLoading(true);
    const location = useLocation();

    await relay.setRelaysAndFollowersAsync();

    let eventsFilter: Filter = { limit: 25 };
    if (location.search == "") {
      eventsFilter = { ...eventsFilter, authors: relay.following };
    }

    setEvents(await relay.fetchEvents(eventsFilter));

    let metaFilter: Filter = { authors: [...new Set(events().map((evt) => evt.pubkey))] };
    if (location.search == "") {
      metaFilter = { ...metaFilter, authors: relay.following };
    }

    let reactionsFilter: Filter[] = events().map((evt) => {
      return { kinds: [Kind.Reaction], "#e": [evt.id] };
    });

    setMetaEvents(await relay.fetchEventsMetadata(metaFilter));
    const reactions = await relay.fetchEventsReactions(reactionsFilter);
    setEnrichedEvents(relay.buildEnrichedEvents(events(), metaEvents(), reactions));

    setIsLoading(false);
  });

  const scrollPage = (direction: "up" | "down"): void => {
    eventWrapperContainer()!.scrollBy({
      behavior: "smooth",
      top: direction == "up" ? -1000 : 1000
    });
  };

  const addHtmlRef = (ref: HTMLDivElement, eventID: string, createdAt: number): void => {
    setEventHtmlRefs(
      [...eventHtmlRefs(), { htmlRef: ref, eventID: eventID, createdAt: createdAt }].sort((ref1, ref2) => {
        return ref1.createdAt > ref2.createdAt ? -1 : 1;
      })
    );
  };

  return (
    <>
      <Show when={useIsNarrow() !== undefined && useIsNarrow()}>
        <div class='snap-y snap-mandatory overflow-scroll overflow-x-hidden h-[100vh]'>
          <For each={enrichedEvents()}>
            {(nostrEvent) => <EventWrapper addHtmlRef={addHtmlRef} event={nostrEvent} />}
          </For>
        </div>
      </Show>

      <Show
        when={!isLoading() && useIsNarrow() !== undefined && !useIsNarrow()}
        fallback={<LoadingFallback />}
      >
        <div class='relative h-full animate-scale-on-load'>
          <div class='absolute top-2 left-5'>
            <NewEventsPopup
              topEventRef={eventHtmlRefs()[0]}
              showPopup={showPopup}
              setShowPopup={setShowPopup}
            />
          </div>

          <div
            ref={(el) => setEventWrapperContainer(el)}
            class='custom-scrollbar snap-y snap-mandatory overflow-scroll overflow-x-hidden h-full'
          >
            <For each={enrichedEvents()}>
              {(nostrEvent) => (
                <EventWrapper event={nostrEvent} scrollPage={scrollPage} addHtmlRef={addHtmlRef} />
              )}
            </For>
          </div>
        </div>
      </Show>
    </>
  );
};

export default Home;
