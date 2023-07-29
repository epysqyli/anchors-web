import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { IUserMetadata } from "~/interfaces/IUserMetadata";
import { Event, Filter, Kind } from "nostr-tools";

const sortByCreatedAt = (evt1: Event, evt2: Event) => {
  return evt1.created_at > evt2.created_at ? -1 : 1;
};

const createMetadataFilter = (pubkeys: string[]): Filter => {
  return { authors: [...new Set(pubkeys)], kinds: [Kind.Metadata] };
};

const enrichEvent = (evt: Event, metadata: IUserMetadata): IEnrichedEvent => {
  return {
    ...evt,
    about: metadata.about,
    name: metadata.name,
    picture: metadata.picture
  };
};

const shrinkContent = (content: string): string => {
  if (content.length > 100) {
    return `${content.substring(0, 100)} ...`;
  }

  return content;
};

const parseDate = (eventDate: number): string => {
  const date = new Date(eventDate * 1000);
  return `${date.toTimeString().split(" ")[0]} ${date.toDateString()}`;
};

export { createMetadataFilter, sortByCreatedAt, enrichEvent, shrinkContent, parseDate };
