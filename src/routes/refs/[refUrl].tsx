import { Event } from "nostr-tools";
import { useParams } from "solid-start";
import Feed from "~/components/feed/Feed";
import { RelayContext } from "~/contexts/relay";
import { useBeforeLeave } from "@solidjs/router";
import { fetchAndSetEvents } from "~/lib/feed/feed";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { IReactionWithEventID } from "~/interfaces/IReaction";
import LoadingFallback from "~/components/feed/LoadingFallback";
import { IUserMetadataWithPubkey } from "~/interfaces/IUserMetadata";
import { sortByCreatedAt, sortByCreatedAtReverse } from "~/lib/nostr/nostr-utils";
import { JSX, Show, VoidComponent, createEffect, createSignal, onMount, useContext } from "solid-js";

const RefUrl: VoidComponent = (): JSX.Element => {
  const MAX_EVENTS_COUNT = 75;
  const FETCH_EVENTS_LIMIT = 33;

  const { relay, isAnchorsMode } = useContext(RelayContext);

  const params = useParams<{ refUrl: string }>();
  let intervalID: NodeJS.Timer | undefined = undefined;

  const [events, setEvents] = createSignal<Event[]>([]);
  const [showPopup, setShowPopup] = createSignal<boolean>(false);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
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
        nostrRefTag: params.refUrl
      }
    );
  };

  onMount(async () => {
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

  useBeforeLeave(() => {
    clearInterval(intervalID);
  });

  return (
    <>
      <Show
        when={!isLoading() && useIsNarrow() !== undefined && !useIsNarrow() && events().length > 0}
        fallback={<LoadingFallback />}
      >
        <Feed
          enrichedEvents={enrichedEvents}
          isLiveFeed={true}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          mergeEnrichedEvents={mergeEnrichedEvents}
        />
      </Show>
    </>
  );
};

export default RefUrl;
