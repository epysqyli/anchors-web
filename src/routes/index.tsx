import { useLocation } from "solid-start";
import { RelayContext } from "~/contexts/relay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import EventWrapper from "~/components/feed/EventWrapper";
import { Event, EventTemplate, Filter } from "nostr-tools";
import { fetchEvents } from "~/lib/nostr/nostr-nips-actions";
import NewEventsPopup from "~/components/feed/NewEventsPopup";
import LoadingFallback from "~/components/feed/LoadingFallback";
import { Component, For, Show, createSignal, onMount, useContext } from "solid-js";

declare global {
  interface Window {
    nostr: {
      signEvent(unsignedEvent: EventTemplate): Promise<Event>;
      getPublicKey(): Promise<string>;
    };
  }
}

interface EventHtmlRef {
  htmlRef: HTMLDivElement;
  eventID: string;
  createdAt: number;
}

const Home: Component<{}> = () => {
  const { relay, following } = useContext(RelayContext);

  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [showPopup, setShowPopup] = createSignal<boolean>(false);
  const [events, setEvents] = createSignal<IEnrichedEvent[]>([], { equals: false });
  const [eventHtmlRefs, setEventHtmlRefs] = createSignal<EventHtmlRef[]>([]);
  const [eventWrapperContainer, setEventWrapperContainer] = createSignal<HTMLDivElement>();

  onMount(() => {
    const location = useLocation();
    let filter: Filter = {};

    if (location.search === "") {
      filter = { authors: following() };
    }

    fetchEvents(relay, setEvents, setIsLoading, filter, setShowPopup);
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
          <For each={events()}>
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
            <For each={events()}>
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
