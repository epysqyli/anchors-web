import Feed from "~/components/feed/Feed";
import { RelayContext } from "~/contexts/relay";
import { useBeforeLeave } from "@solidjs/router";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import { useParams, useSearchParams } from "solid-start";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { FeedSearchParams } from "~/types/FeedSearchParams";
import { IReactionWithEventID } from "~/interfaces/IReaction";
import LoadingFallback from "~/components/feed/LoadingFallback";
import { IUserMetadataWithPubkey } from "~/interfaces/IUserMetadata";
import { fetchAndSetEvents, fetchAndSetOlderEvents } from "~/lib/feed/feed";
import { sortByCreatedAt, sortByCreatedAtReverse } from "~/lib/nostr/nostr-utils";
import { JSX, Show, VoidComponent, createEffect, createSignal, onMount, useContext } from "solid-js";
import { Event } from "nostr-tools";

const Tag: VoidComponent = (): JSX.Element => {
  const MAX_EVENTS_COUNT = 75;
  const FETCH_EVENTS_LIMIT = 33;

  const params = useParams<{ tag: string }>();

  const { relay, anchorsMode } = useContext(RelayContext);
  let intervalID: NodeJS.Timer | undefined = undefined;
  const [searchParams] = useSearchParams<FeedSearchParams>();

  const [events, setEvents] = createSignal<Event[]>([]);
  const [showPopup, setShowPopup] = createSignal<boolean>(false);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [metaEvents, setMetaEvents] = createSignal<IUserMetadataWithPubkey[]>([]);
  const [reactions, setReactions] = createSignal<IReactionWithEventID[]>([]);
  const [enrichedEvents, setEnrichedEvents] = createSignal<IEnrichedEvent[]>([]);
  const [newEnrichedEvents, setNewEnrichedEvents] = createSignal<IEnrichedEvent[]>([]);
  const [mostRecentOlderEventIndex, setMostRecentOlderEventIndex] = createSignal<number>(0);
  const [isFeedOver, setIsFeedOver] = createSignal<boolean>(false);

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
      anchorsMode.get,
      setShowPopup,
      {
        fetchEventsLimit: FETCH_EVENTS_LIMIT,
        maxEventsCount: MAX_EVENTS_COUNT,
        nostrHashTag: params.tag
      }
    );
  };

  onMount(async () => {
    intervalID = await startFetchAndSetEventsInterval();
  });

  createEffect(async () => {
    anchorsMode.get();
    clearInterval(intervalID);

    setEvents([]);
    setEnrichedEvents([]);
    setNewEnrichedEvents([]);
    setMetaEvents([]);
    setReactions([]);
    setShowPopup(false);

    intervalID = await startFetchAndSetEventsInterval();
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

  const loadOlderPosts = async (): Promise<void> => {
    setIsLoading(true);
    const latestEventsCount = enrichedEvents().length;

    const fetchOlderEventsResults = await fetchAndSetOlderEvents(
      relay,
      {
        fetchEventsLimit: 5,
        maxEventsCount: 75,
        searchParams: searchParams
      },
      anchorsMode.get,
      enrichedEvents,
      setEnrichedEvents
    );

    setIsFeedOver(fetchOlderEventsResults.olderEventsCount == 0);

    if (fetchOlderEventsResults.olderEventsCount) {
      setMostRecentOlderEventIndex(latestEventsCount);
    }

    setIsLoading(false);
  };

  useBeforeLeave(() => {
    clearInterval(intervalID);
  });

  return (
    <>
      <Show
        when={!isLoading() && useIsNarrow() !== undefined && !useIsNarrow()}
        fallback={<LoadingFallback />}
      >
        <Feed
          enrichedEvents={enrichedEvents}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          mergeEnrichedEvents={mergeEnrichedEvents}
          isFeedOver={isFeedOver}
          loadOlderPosts={loadOlderPosts}
          mostRecentOlderEventIndex={mostRecentOlderEventIndex}
        />
      </Show>
    </>
  );
};

export default Tag;
