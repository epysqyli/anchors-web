import { Event } from "nostr-tools";

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

export { getNewUniqueEvents, getNewEventsAuthors, getFetchSinceTimestamp };
