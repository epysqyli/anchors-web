import { Motion } from "@motionone/solid";
import { RelayContext } from "~/contexts/relay";
import { Event, EventTemplate } from "nostr-tools";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import EventWrapper from "~/components/feed/EventWrapper";
import { fetchEvents } from "~/lib/nostr/nostr-nips-actions";
import NewEventsPopup from "~/components/feed/NewEventsPopup";
import LoadingFallback from "~/components/feed/LoadingFallback";
import { Component, For, Show, createEffect, createSignal, onMount, useContext } from "solid-js";

declare global {
  interface Window {
    nostr: {
      signEvent(unsignedEvent: EventTemplate): Promise<Event>;
      getPublicKey(): Promise<string>;
    };
  }
}

const Home: Component<{}> = () => {
  const relay = useContext(RelayContext);

  const [events, setEvents] = createSignal<IEnrichedEvent[]>([], { equals: false });
  const [eventWrapperContainer, setEventWrapperContainer] = createSignal<HTMLDivElement>();
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [showPopup, setShowPopup] = createSignal<boolean>(false);
  const [topEventRef, setTopEventRef] = createSignal<HTMLDivElement>();
  const [topEventID, setTopEventID] = createSignal<string>("");

  onMount(() => fetchEvents(relay, setEvents, setShowPopup, setIsLoading));

  const scrollPage = (direction: "up" | "down"): void => {
    eventWrapperContainer()!.scrollBy({
      behavior: "smooth",
      top: direction == "up" ? -1000 : 1000
    });
  };

  const assignTopEventRef = (ref: HTMLDivElement, eventID: string): void => {
    if (eventID == topEventID()) {
      setTopEventRef(ref);
    }
  };

  createEffect(() => {
    if (events().length !== 0) {
      setTopEventID(events()[0].id);
      console.log(topEventID());
    }
  });

  return (
    <>
      <Show when={useIsNarrow() !== undefined && useIsNarrow()}>
        <div class='snap-y snap-mandatory overflow-scroll overflow-x-hidden h-[100vh]'>
          <For each={events()}>
            {(nostrEvent) => (
              <EventWrapper
                assignTopEventRef={assignTopEventRef}
                event={nostrEvent}
                isNarrow={useIsNarrow()}
              />
            )}
          </For>
        </div>
      </Show>

      <Show
        when={!isLoading() && useIsNarrow() !== undefined && !useIsNarrow()}
        fallback={<LoadingFallback />}
      >
        <Motion.div animate={{ opacity: [0.7, 1], scale: [0.8, 1] }} class='relative h-full'>
          <div class='absolute top-2 left-5'>
            <NewEventsPopup topEventRef={topEventRef} showPopup={showPopup} setShowPopup={setShowPopup} />
          </div>

          <div
            ref={(el) => setEventWrapperContainer(el)}
            class='custom-scrollbar snap-y snap-mandatory overflow-scroll overflow-x-hidden h-full'
          >
            <For each={events()}>
              {(nostrEvent) => (
                <EventWrapper
                  assignTopEventRef={assignTopEventRef}
                  event={nostrEvent}
                  isNarrow={useIsNarrow()}
                  scrollPage={scrollPage}
                />
              )}
            </For>
          </div>
        </Motion.div>
      </Show>
    </>
  );
};

export default Home;
