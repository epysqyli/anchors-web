import Relayer from "../nostr/relayer";
import { Accessor, Setter } from "solid-js";
import { Event, Filter, Kind } from "nostr-tools";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { FeedSearchParams } from "~/types/FeedSearchParams";
import { sortByCreatedAtReverse } from "../nostr/nostr-utils";
import { IReactionWithEventID } from "~/interfaces/IReaction";
import { IUserMetadataWithPubkey } from "~/interfaces/IUserMetadata";

const getNewUniqueEvents = (currentEvents: Event[], newEvents: Event[]): Event[] => {
  const newEventsIDs = newEvents.map((e) => e.id);
  const oldEventsIDs = currentEvents.map((e) => e.id);
  const uniqueNewEventsIDs = newEventsIDs.filter((newID) => !oldEventsIDs.includes(newID));
  return newEvents.filter((newEvt) => uniqueNewEventsIDs.includes(newEvt.id));
};

const getNewEventsAuthors = (currentEvents: Event[], newEvents: Event[]): string[] => {
  const newEventsAuthors: string[] = newEvents.map((e) => e.pubkey);
  const oldEventsAuthors: string[] = currentEvents.map((e) => e.pubkey);
  return newEventsAuthors.filter((newPk) => !oldEventsAuthors.includes(newPk));
};

const getFetchSinceTimestamp = (currentEvents: Event[], newEvents: Event[]): number => {
  let fetchSinceTimestamp = Math.floor(Date.now() / 1000);

  if (newEvents.length || currentEvents.length) {
    fetchSinceTimestamp = newEvents.length == 0 ? currentEvents[0].created_at : newEvents[0].created_at;
  }

  return fetchSinceTimestamp;
};

const fetchAndSetEvents = async (
  relay: Relayer,
  setIsLoading: Setter<boolean>,
  events: Accessor<Event[]>,
  setEvents: Setter<Event[]>,
  metaEvents: Accessor<IUserMetadataWithPubkey[]>,
  setMetaEvents: Setter<IUserMetadataWithPubkey[]>,
  reactions: Accessor<IReactionWithEventID[]>,
  setReactions: Setter<IReactionWithEventID[]>,
  enrichedEvents: Accessor<IEnrichedEvent[]>,
  setEnrichedEvents: Setter<IEnrichedEvent[]>,
  newEnrichedEvents: Accessor<IEnrichedEvent[]>,
  setNewEnrichedEvents: Setter<IEnrichedEvent[]>,
  isAnchorsMode: Accessor<boolean>,
  setShowPopup: Setter<boolean>,
  fetchParams: {
    fetchEventsLimit: number;
    maxEventsCount: number;
    searchParams?: FeedSearchParams;
    nostrRefTag?: string;
    nostrHashTag?: string;
  }
): Promise<NodeJS.Timer> => {
  setIsLoading(true);

  if (fetchParams.searchParams != undefined) {
    setEvents(
      await relay.fetchTextEvents({
        rootOnly: true,
        isAnchorsMode: isAnchorsMode(),
        feedSearchParams: fetchParams.searchParams,
        filter: { limit: fetchParams.fetchEventsLimit }
      })
    );
  }

  if (fetchParams.nostrRefTag != undefined) {
    setEvents(
      await relay.fetchTextEvents({
        rootOnly: true,
        isAnchorsMode: isAnchorsMode(),
        filter: { limit: fetchParams.fetchEventsLimit, "#r": [fetchParams.nostrRefTag] }
      })
    );
  }

  if (fetchParams.nostrHashTag != undefined) {
    setEvents(
      await relay.fetchTextEvents({
        rootOnly: true,
        isAnchorsMode: isAnchorsMode(),
        filter: { limit: fetchParams.fetchEventsLimit, "#t": [fetchParams.nostrHashTag] }
      })
    );
  }

  let metaFilter: Filter = { authors: [...new Set(events().map((evt) => evt.pubkey))] };
  if (fetchParams.searchParams?.following == "on") {
    metaFilter = { authors: relay.following };
  }

  setMetaEvents(await relay.fetchEventsMetadata(metaFilter));

  const reactionsFilter: Filter[] = events().map((evt) => {
    return { kinds: [Kind.Reaction], "#e": [evt.id] };
  });

  setReactions(await relay.fetchEventsReactions(reactionsFilter));
  setEnrichedEvents(relay.buildEnrichedEvents(events(), metaEvents(), reactions()));

  setIsLoading(false);

  const intervalID = setInterval(async () => {
    let fetchSinceTimestamp = getFetchSinceTimestamp(enrichedEvents(), newEnrichedEvents());

    let newEvents: Event[] = [];

    if (fetchParams.searchParams != undefined) {
      newEvents = await relay.fetchTextEvents({
        rootOnly: true,
        isAnchorsMode: isAnchorsMode(),
        feedSearchParams: fetchParams.searchParams,
        filter: { limit: fetchParams.fetchEventsLimit, since: fetchSinceTimestamp + 1 }
      });
    }

    if (fetchParams.nostrRefTag != undefined) {
      newEvents = await relay.fetchTextEvents({
        rootOnly: true,
        isAnchorsMode: isAnchorsMode(),
        filter: {
          limit: fetchParams.fetchEventsLimit,
          since: fetchSinceTimestamp + 1,
          "#r": [fetchParams.nostrRefTag]
        }
      });
    }

    if (fetchParams.nostrHashTag != undefined) {
      newEvents = await relay.fetchTextEvents({
        rootOnly: true,
        isAnchorsMode: isAnchorsMode(),
        filter: {
          limit: fetchParams.fetchEventsLimit,
          since: fetchSinceTimestamp + 1,
          "#t": [fetchParams.nostrHashTag]
        }
      });
    }

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

      if (newEventsCount >= fetchParams.maxEventsCount) {
        const newEventsToSet = [
          ...newEnrichedEvents(),
          ...relay.buildEnrichedEvents(newUniqueEvents, metaEvents(), reactions())
        ]
          .sort(sortByCreatedAtReverse)
          .slice(newEventsCount - fetchParams.maxEventsCount, newEventsCount);

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

  return intervalID;
};

export { fetchAndSetEvents };
