import { useLocation } from "solid-start";
import OverlayContext from "~/contexts/overlay";
import { RelayContext } from "~/contexts/relay";
import { BsCloudDownload } from "solid-icons/bs";
import { useBeforeLeave } from "@solidjs/router";
import { Event, Filter, Kind } from "nostr-tools";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import EventWrapper from "~/components/feed/EventWrapper";
import { IReactionWithEventID } from "~/interfaces/IReaction";
import NewEventsPopup from "~/components/feed/NewEventsPopup";
import LoadingPoints from "~/components/feed/LoadingPoints";
import { IUserMetadataWithPubkey } from "~/interfaces/IUserMetadata";
import { sortByCreatedAt, sortByCreatedAtReverse } from "~/lib/nostr/nostr-utils";
import { Component, For, Show, createEffect, createSignal, onMount, useContext } from "solid-js";

interface EventHtmlRef {
  htmlRef: HTMLDivElement;
  eventID: string;
  createdAt: number;
}

const Home: Component<{}> = () => {
  const FETCH_EVENTS_LIMIT = 33;
  const MAX_EVENTS_COUNT = 75;

  const { relay, isAnchorsMode } = useContext(RelayContext);
  const overlay = useContext(OverlayContext);

  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [showPopup, setShowPopup] = createSignal<boolean>(false);
  const [eventHtmlRefs, setEventHtmlRefs] = createSignal<EventHtmlRef[]>([]);
  const [eventWrapperContainer, setEventWrapperContainer] = createSignal<HTMLDivElement>();

  let intervalID: NodeJS.Timer | undefined = undefined;
  const [events, setEvents] = createSignal<Event[]>([]);
  const [metaEvents, setMetaEvents] = createSignal<IUserMetadataWithPubkey[]>([]);
  const [reactions, setReactions] = createSignal<IReactionWithEventID[]>([]);
  const [enrichedEvents, setEnrichedEvents] = createSignal<IEnrichedEvent[]>([]);
  const [newEnrichedEvents, setNewEnrichedEvents] = createSignal<IEnrichedEvent[]>([]);

  const fetchAndSetEvents = async (): Promise<void> => {
    setIsLoading(true);
    if (intervalID) {
      clearInterval(intervalID);
    }

    const location = useLocation();

    let eventsFilter: Filter = { limit: FETCH_EVENTS_LIMIT };
    if (location.search == "") {
      eventsFilter = { ...eventsFilter, authors: relay.following };
    }

    setEvents(await relay.fetchTextEvents(eventsFilter, { rootOnly: true, isAnchorsMode: isAnchorsMode() }));

    let metaFilter: Filter = { authors: [...new Set(events().map((evt) => evt.pubkey))] };
    if (location.search == "") {
      metaFilter = { authors: relay.following };
    }

    setMetaEvents(await relay.fetchEventsMetadata(metaFilter));

    let reactionsFilter: Filter[] = events().map((evt) => {
      return { kinds: [Kind.Reaction], "#e": [evt.id] };
    });

    setReactions(await relay.fetchEventsReactions(reactionsFilter));
    setEnrichedEvents(relay.buildEnrichedEvents(events(), metaEvents(), reactions()));

    setIsLoading(false);

    const intervalIdentifier = setInterval(async () => {
      let fetchSinceTimestamp = Math.floor(Date.now() / 1000);
      if (newEnrichedEvents().length || enrichedEvents().length) {
        fetchSinceTimestamp =
          newEnrichedEvents().length == 0
            ? enrichedEvents()[0].created_at
            : newEnrichedEvents()[0].created_at;
      }

      const newEvents: Event[] = await relay.fetchTextEvents(
        {
          ...eventsFilter,
          since: fetchSinceTimestamp + 1
        },
        { rootOnly: true, isAnchorsMode: isAnchorsMode() }
      );

      if (newEvents.length !== 0) {
        const newEventsIDs = newEvents.map((e) => e.id);
        const oldEventsIDs = events().map((e) => e.id);
        const uniqueNewEventsIDs = newEventsIDs.filter((newID) => !oldEventsIDs.includes(newID));
        const newUniqueEvents = newEvents.filter((newEvt) => uniqueNewEventsIDs.includes(newEvt.id));

        setEvents([...events(), ...newUniqueEvents]);

        const newEventsAuthors: string[] = newUniqueEvents.map((e) => e.pubkey);
        const oldEventsAuthors: string[] = events().map((e) => e.pubkey);
        const diffAuthors: string[] = newEventsAuthors.filter((newPk) =>
          oldEventsAuthors.find((oldPk) => oldPk !== newPk)
        );

        if (diffAuthors.length !== 0) {
          let metaFilter: Filter = { authors: [...new Set(diffAuthors)] };
          const recentMetaEvents: IUserMetadataWithPubkey[] = await relay.fetchEventsMetadata(metaFilter);
          setMetaEvents([...metaEvents(), ...recentMetaEvents]);
        }

        const reactionsFilter: Filter[] = newUniqueEvents.map((evt) => {
          return { kinds: [Kind.Reaction], "#e": [evt.id] };
        });

        const recentReactions: IReactionWithEventID[] = await relay.fetchEventsReactions(reactionsFilter);
        const newReactions: IReactionWithEventID[] = recentReactions.filter(
          (re) => !reactions().find((r) => r.eventID === re.eventID)
        );

        setReactions([...reactions(), ...newReactions]);

        const newEventsCount = newEnrichedEvents().length + newUniqueEvents.length;
        if (newEventsCount >= MAX_EVENTS_COUNT) {
          const newEventsToSet = [
            ...newEnrichedEvents(),
            ...relay.buildEnrichedEvents(newUniqueEvents, metaEvents(), reactions())
          ]
            .sort(sortByCreatedAtReverse)
            .slice(newEventsCount - MAX_EVENTS_COUNT, newEventsCount);

          setNewEnrichedEvents(newEventsToSet);
        } else {
          setNewEnrichedEvents([
            ...newEnrichedEvents(),
            ...relay.buildEnrichedEvents(newUniqueEvents, metaEvents(), reactions())
          ]);
        }

        setShowPopup(true);
      }
    }, relay.FETCH_INTERVAL_MS);

    intervalID = intervalIdentifier;
  };

  onMount(async () => {
    await fetchAndSetEvents();
  });

  createEffect(async () => {
    isAnchorsMode();
    clearInterval(intervalID);

    setEvents([]);
    setEnrichedEvents([]);
    setNewEnrichedEvents([]);
    setMetaEvents([]);
    setReactions([]);
    setShowPopup(false);

    await fetchAndSetEvents();
  });

  useBeforeLeave(() => {
    clearInterval(intervalID);
  });

  const mergeEnrichedEvents = (): void => {
    const eventsCount = enrichedEvents().length + newEnrichedEvents().length;
    const eventsToSet = [...enrichedEvents(), ...newEnrichedEvents()].sort(sortByCreatedAtReverse);

    if (eventsCount > MAX_EVENTS_COUNT) {
      setEnrichedEvents(eventsToSet.slice(eventsCount - MAX_EVENTS_COUNT, eventsCount).sort(sortByCreatedAt));
    } else {
      setEnrichedEvents([...enrichedEvents(), ...newEnrichedEvents()].sort(sortByCreatedAt));
    }

    setNewEnrichedEvents([]);
  };

  const scrollPage = (direction: "up" | "down"): void => {
    eventWrapperContainer()!.scrollBy({
      behavior: "smooth",
      top: direction == "up" ? -1000 : 1000
    });
  };

  // there should be a better way to handle this
  const addHtmlRef = (ref: HTMLDivElement, eventID: string, createdAt: number): void => {
    setEventHtmlRefs(
      [...eventHtmlRefs(), { htmlRef: ref, eventID: eventID, createdAt: createdAt }].sort((ref1, ref2) => {
        return ref1.createdAt > ref2.createdAt ? -1 : 1;
      })
    );
  };

  const eventWrapperContainerStyle = (): string => {
    if (!overlay.showOverlay()) {
      return "custom-scrollbar snap-y snap-mandatory overflow-x-hidden h-full";
    }

    return "custom-scrollbar snap-y snap-mandatory overflow-hidden h-full";
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

      <Show when={!isLoading() && useIsNarrow() !== undefined && !useIsNarrow()} fallback={<LoadingPoints />}>
        <div class='relative h-full animate-scale-on-load'>
          <div class='absolute top-3 left-5'>
            <NewEventsPopup
              topEventRef={eventHtmlRefs()[0]}
              showPopup={showPopup}
              setShowPopup={setShowPopup}
              mergeEnrichedEvents={mergeEnrichedEvents}
            />
          </div>

          <div ref={(el) => setEventWrapperContainer(el)} class={eventWrapperContainerStyle()}>
            <For each={enrichedEvents()}>
              {(nostrEvent) => (
                <EventWrapper event={nostrEvent} scrollPage={scrollPage} addHtmlRef={addHtmlRef} />
              )}
            </For>

            <div class='relative snap-start h-full text-slate-300'>
              <div
                class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          cursor-pointer p-20 border rounded-full border-slate-600
                          hover:shadow-lg shadow-slate-500 active:shadow-none active:border-slate-800'
              >
                <BsCloudDownload size={60} class='mx-auto' />
                <p class='text-center mt-10 text-lg select-none'>load older posts</p>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default Home;
