import NoEvents from "./NoEvents";
import EventWrapper from "./EventWrapper";
import NewEventsPopup from "./NewEventsPopup";
import OverlayContext from "~/contexts/overlay";
import { BsCloudDownload } from "solid-icons/bs";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { Accessor, Component, For, JSX, Setter, Show, createSignal, onMount, useContext } from "solid-js";

interface EventHtmlRef {
  htmlRef: HTMLDivElement;
  eventID: string;
  createdAt: number;
}

interface Props {
  showPopup?: Accessor<boolean>;
  setShowPopup?: Setter<boolean>;
  mergeEnrichedEvents?(): void;
  enrichedEvents: Accessor<IEnrichedEvent[]>;
  loadOlderPosts(): Promise<void>;
  isFeedOver: Accessor<boolean>;
  mostRecentOlderEventIndex: Accessor<number>;
}

const Feed: Component<Props> = (props): JSX.Element => {
  const overlay = useContext(OverlayContext);

  const [eventHtmlRefs, setEventHtmlRefs] = createSignal<EventHtmlRef[]>([]);
  const [eventWrapperContainer, setEventWrapperContainer] = createSignal<HTMLDivElement>();

  const addHtmlRef = (ref: HTMLDivElement, eventID: string, createdAt: number): void => {
    setEventHtmlRefs(
      [...eventHtmlRefs(), { htmlRef: ref, eventID: eventID, createdAt: createdAt }].sort((ref1, ref2) => {
        return ref1.createdAt > ref2.createdAt ? -1 : 1;
      })
    );
  };

  const eventWrapperContainerStyle = (): string => {
    if (!overlay.showOverlay()) {
      return "md:custom-scrollbar snap-y snap-mandatory overflow-x-hidden h-full";
    }

    return "md:custom-scrollbar snap-y snap-mandatory overflow-hidden h-full";
  };

  const scrollPage = (direction: "up" | "down"): void => {
    eventWrapperContainer()!.scrollBy({
      behavior: "smooth",
      top: direction == "up" ? -1000 : 1000
    });
  };

  onMount(async () => {
    if (props.mostRecentOlderEventIndex()) {
      eventHtmlRefs()[props.mostRecentOlderEventIndex()].htmlRef.scrollIntoView(
        useIsNarrow() != undefined && useIsNarrow() ? {} : { behavior: "smooth" }
      );
    }
  });

  return (
    <>
      <Show when={useIsNarrow() != undefined && useIsNarrow()}>
        <div class='absolute bottom-[9dvh] right-5'>
          <NewEventsPopup
            topEventRef={eventHtmlRefs()[0]}
            showPopup={props.showPopup!}
            setShowPopup={props.setShowPopup!}
            mergeEnrichedEvents={props.mergeEnrichedEvents!}
          />
        </div>

        <div class='snap-y snap-mandatory overflow-scroll overflow-x-hidden h-[100vh]'>
          <For each={props.enrichedEvents()}>
            {(nostrEvent) => <EventWrapper addHtmlRef={addHtmlRef} event={nostrEvent} />}
          </For>

          <Show when={props.enrichedEvents().length && !props.isFeedOver()} fallback={<NoEvents />}>
            <div class='relative snap-start h-[100dvh]'>
              <div
                onClick={props.loadOlderPosts}
                class='w-[90vw] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      py-20 text-neutral-300 bg-slate-700 active:bg-slate-600 rounded-3xl'
              >
                <BsCloudDownload size={60} class='mx-auto' />
                <p class='text-center mt-10 text-lg select-none'>load older posts</p>
              </div>
            </div>
          </Show>
        </div>
      </Show>

      <Show when={useIsNarrow() != undefined && !useIsNarrow()}>
        <div class='relative h-full animate-scale-on-load'>
          <div class='absolute top-3 right-8'>
            <NewEventsPopup
              topEventRef={eventHtmlRefs()[0]}
              showPopup={props.showPopup!}
              setShowPopup={props.setShowPopup!}
              mergeEnrichedEvents={props.mergeEnrichedEvents!}
            />
          </div>

          <div ref={(el) => setEventWrapperContainer(el)} class={eventWrapperContainerStyle()}>
            <For each={props.enrichedEvents()}>
              {(nostrEvent) => (
                <EventWrapper event={nostrEvent} scrollPage={scrollPage} addHtmlRef={addHtmlRef} />
              )}
            </For>

            <Show when={props.enrichedEvents().length && !props.isFeedOver()} fallback={<NoEvents />}>
              <div class='relative snap-start h-full text-slate-300'>
                <div
                  onClick={props.loadOlderPosts}
                  class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  cursor-pointer p-20 border rounded-full border-slate-600
                  hover:shadow-lg shadow-slate-500 active:shadow-none active:border-slate-800'
                >
                  <BsCloudDownload size={60} class='mx-auto' />
                  <p class='text-center mt-10 text-lg select-none'>load older posts</p>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </>
  );
};

export default Feed;
