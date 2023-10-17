import { useParams } from "solid-start";
import Feed from "~/components/feed/Feed";
import { RelayContext } from "~/contexts/relay";
import { useBeforeLeave } from "@solidjs/router";
import { Event, Filter, Kind } from "nostr-tools";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { IReactionWithEventID } from "~/interfaces/IReaction";
import LoadingFallback from "~/components/feed/LoadingFallback";
import { IUserMetadataWithPubkey } from "~/interfaces/IUserMetadata";
import { sortByCreatedAt, sortByCreatedAtReverse } from "~/lib/nostr/nostr-utils";
import { getFetchSinceTimestamp, getNewEventsAuthors, getNewUniqueEvents } from "~/lib/feed/feed";
import { JSX, Show, VoidComponent, createEffect, createSignal, onMount, useContext } from "solid-js";

const RefUrl: VoidComponent = (): JSX.Element => {
  const FETCH_EVENTS_LIMIT = 33;
  const MAX_EVENTS_COUNT = 75;

  const { relay, isAnchorsMode } = useContext(RelayContext);

  const params = useParams<{ refUrl: string }>();
  let intervalID: NodeJS.Timer | undefined = undefined;

  const [events, setEvents] = createSignal<Event[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [metaEvents, setMetaEvents] = createSignal<IUserMetadataWithPubkey[]>([]);
  const [reactions, setReactions] = createSignal<IReactionWithEventID[]>([]);
  const [enrichedEvents, setEnrichedEvents] = createSignal<IEnrichedEvent[]>([]);
  const [newEnrichedEvents, setNewEnrichedEvents] = createSignal<IEnrichedEvent[]>([]);
  const [showPopup, setShowPopup] = createSignal<boolean>(false);

  const fetchAndSetEvents = async (): Promise<void> => {
    setIsLoading(true);
    if (intervalID) {
      clearInterval(intervalID);
    }

    setEvents(
      await relay.fetchTextEvents({
        rootOnly: true,
        isAnchorsMode: isAnchorsMode(),
        filter: { "#r": [params.refUrl], limit: MAX_EVENTS_COUNT }
      })
    );

    let metaFilter: Filter = { authors: [...new Set(events().map((evt) => evt.pubkey))] };

    setMetaEvents(await relay.fetchEventsMetadata(metaFilter));

    const reactionsFilter: Filter[] = events().map((evt) => {
      return { kinds: [Kind.Reaction], "#e": [evt.id] };
    });

    setReactions(await relay.fetchEventsReactions(reactionsFilter));
    setEnrichedEvents(relay.buildEnrichedEvents(events(), metaEvents(), reactions()));

    setIsLoading(false);

    const intervalIdentifier = setInterval(async () => {
      let fetchSinceTimestamp = getFetchSinceTimestamp(enrichedEvents(), newEnrichedEvents());

      const newEvents: Event[] = await relay.fetchTextEvents({
        rootOnly: true,
        isAnchorsMode: isAnchorsMode(),
        filter: { "#r": [params.refUrl], limit: FETCH_EVENTS_LIMIT, since: fetchSinceTimestamp + 1 }
      });

      if (newEvents.length !== 0) {
        const newUniqueEvents = getNewUniqueEvents(events(), newEvents);
        const newEventsAuthors = getNewEventsAuthors(events(), newUniqueEvents);
        setEvents([...events(), ...newUniqueEvents]);

        if (newEventsAuthors.length !== 0) {
          const metaFilter: Filter = { authors: [...new Set(newEventsAuthors)] };
          const recentMetaEvents: IUserMetadataWithPubkey[] = await relay.fetchEventsMetadata(metaFilter);
          setMetaEvents([...metaEvents(), ...recentMetaEvents]);
        }

        const recentReactions: IReactionWithEventID[] = await relay.fetchEventsReactions(
          newUniqueEvents.map((evt) => ({ kinds: [Kind.Reaction], "#e": [evt.id] }))
        );

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
