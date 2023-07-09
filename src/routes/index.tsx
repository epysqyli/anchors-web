import { RelayContext } from "~/contexts/relay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import EventWrapper from "~/components/feed/EventWrapper";
import { IUserMetadata } from "~/interfaces/IUserMetadata";
import { Component, For, Show, createEffect, createSignal, onMount, useContext } from "solid-js";
import { Event, Filter, Kind, Sub, validateEvent, verifySignature } from "nostr-tools";
import NewEventsPopup from "~/components/feed/NewEventsPopup";

const Home: Component<{}> = () => {
  const relay = useContext(RelayContext);

  const [events, setEvents] = createSignal<IEnrichedEvent[]>([]);
  const [eventWrapperContainer, setEventWrapperContainer] = createSignal<HTMLDivElement>();
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [eoseRecv, setEoseRecv] = createSignal<boolean>(false);
  const [showPopup, setShowPopup] = createSignal<boolean>(false);
  const [topEventRef, setTopEventRef] = createSignal<HTMLDivElement>();
  const [topEventID, setTopEventID] = createSignal<string>("");

  const sortByCreatedAt = (evt1: Event, evt2: Event) => {
    return evt1.created_at > evt2.created_at ? -1 : 1;
  };

  // TODO: refactor into nostr utils
  onMount(async () => {
    setIsLoading(true);
    const eventsSub: Sub = relay.sub([{}]);

    eventsSub.on("event", (nostrEvent: Event) => {
      if (nostrEvent.kind === Kind.Text && validateEvent(nostrEvent) && verifySignature(nostrEvent)) {
        setEvents([...events(), { ...nostrEvent, name: "", picture: "", about: "" }].sort(sortByCreatedAt));
      }

      if (eoseRecv()) {
        const metadataFilter: Filter = {
          authors: [nostrEvent.pubkey],
          kinds: [Kind.Metadata]
        };

        const metadataSub: Sub = relay.sub([metadataFilter]);
        metadataSub.on("event", (metadataEvent) => {
          const userMetadata: IUserMetadata = JSON.parse(metadataEvent.content);

          const newEnrichedEvents = events()
            .filter((ev) => ev.pubkey === metadataEvent.pubkey)
            .map((ev) => {
              return {
                ...ev,
                about: userMetadata.about,
                name: userMetadata.name,
                picture: userMetadata.picture
              };
            });

          const remainingEvents = events().filter((ev) => ev.pubkey != metadataEvent.pubkey);

          setEvents([...remainingEvents, ...newEnrichedEvents].sort(sortByCreatedAt));
        });

        metadataSub.on("eose", () => {
          setShowPopup(true);
        });
      }
    });

    eventsSub.on("eose", () => {
      const metadataFilter: Filter = {
        authors: [...new Set(events().map((e) => e.pubkey))],
        kinds: [Kind.Metadata]
      };

      const metadataSub: Sub = relay.sub([metadataFilter]);

      metadataSub.on("event", (metadataEvent) => {
        const userMetadata: IUserMetadata = JSON.parse(metadataEvent.content);

        const newEnrichedEvents = events()
          .filter((ev) => ev.pubkey === metadataEvent.pubkey)
          .map((ev) => {
            return {
              ...ev,
              about: userMetadata.about,
              name: userMetadata.name,
              picture: userMetadata.picture
            };
          });

        const remainingEvents = events().filter((ev) => ev.pubkey != metadataEvent.pubkey);

        setEvents([...remainingEvents, ...newEnrichedEvents].sort(sortByCreatedAt));
      });

      metadataSub.on("eose", () => {
        setEoseRecv(true);
        setIsLoading(false);
      });
    });
  });

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

      <Show when={useIsNarrow() !== undefined && !useIsNarrow() && !isLoading()}>
        <div class='relative h-full'>
          <div class='absolute top-3 left-3'>
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
        </div>
      </Show>

      <Show when={useIsNarrow() !== undefined && !useIsNarrow() && isLoading()}>
        <div class='w-5/6 mx-auto h-full py-20 px-10'>
          <div class='flex items-center gap-x-10 justify-around h-5/6'>
            <div class='w-3/5 rounded-md h-full bg-slate-800 border border-opacity-25 border-slate-400 animate-pulse'></div>
            <div class='w-2/5 rounded-md h-full bg-slate-800 border border-opacity-25 border-slate-400 animate-pulse'></div>
          </div>

          <div class='h-1/6 mt-5 rounded-md bg-slate-800 border border-opacity-25 border-slate-400 animate-pulse'></div>
        </div>
      </Show>
    </>
  );
};

export default Home;
