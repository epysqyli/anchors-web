import { Event } from "nostr-tools";
import Feed from "~/components/feed/Feed";
import { RelayContext } from "~/contexts/relay";
import { fetchAndSetEvents } from "~/lib/feed/feed";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { FeedSearchParams } from "~/types/FeedSearchParams";
import { IReactionWithEventID } from "~/interfaces/IReaction";
import LoadingPoints from "~/components/feed/LoadingPoints";
import { useBeforeLeave, useSearchParams } from "@solidjs/router";
import { IUserMetadataWithPubkey } from "~/interfaces/IUserMetadata";
import { sortByCreatedAt, sortByCreatedAtReverse } from "~/lib/nostr/nostr-utils";
import { Component, Show, createEffect, createSignal, onMount, useContext } from "solid-js";

const Home: Component<{}> = () => {
  const FETCH_EVENTS_LIMIT = 33;
  const MAX_EVENTS_COUNT = 75;

  const { relay, isAnchorsMode } = useContext(RelayContext);

  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [showPopup, setShowPopup] = createSignal<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams<FeedSearchParams>();

  let intervalID: NodeJS.Timer | undefined;
  const [events, setEvents] = createSignal<Event[]>([]);
  const [metaEvents, setMetaEvents] = createSignal<IUserMetadataWithPubkey[]>([]);
  const [reactions, setReactions] = createSignal<IReactionWithEventID[]>([]);
  const [enrichedEvents, setEnrichedEvents] = createSignal<IEnrichedEvent[]>([]);
  const [newEnrichedEvents, setNewEnrichedEvents] = createSignal<IEnrichedEvent[]>([]);

  const startFetchAndSetEventsInterval = async (): Promise<NodeJS.Timer> => {
    return await fetchAndSetEvents(
      relay,
      setIsLoading,
      events,
      setEvents,
      metaEvents,
      setMetaEvents,
      reactions,
      setReactions,
      enrichedEvents,
      setEnrichedEvents,
      newEnrichedEvents,
      setNewEnrichedEvents,
      isAnchorsMode,
      setShowPopup,
      {
        fetchEventsLimit: FETCH_EVENTS_LIMIT,
        maxEventsCount: MAX_EVENTS_COUNT,
        searchParams: searchParams
      }
    );
  };

  onMount(async () => {
    if (searchParams.following == undefined || searchParams.following == "undefined") {
      setSearchParams({ ...searchParams, following: "on" });
    }

    if (searchParams.relayAddress == undefined || searchParams.relayAddress == "undefined") {
      setSearchParams({ ...searchParams, relayAddress: "all" });
    }

    intervalID = await startFetchAndSetEventsInterval();
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

    intervalID = await startFetchAndSetEventsInterval();
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

  return (
    <>
      <Show when={!isLoading()} fallback={<LoadingPoints />}>
        <Feed
          isLiveFeed={true}
          enrichedEvents={enrichedEvents}
          mergeEnrichedEvents={mergeEnrichedEvents}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
        />
      </Show>
    </>
  );
};

export default Home;
