import { Event, Filter, Kind } from "nostr-tools";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { IUserMetadata } from "~/interfaces/IUserMetadata";

const sortByCreatedAt = (evt1: Event, evt2: Event) => {
  return evt1.created_at > evt2.created_at ? -1 : 1;
};

// should return an array
const createMetadataFilter = (pubkeys: string[]): Filter => {
  return { authors: [...new Set(pubkeys)], kinds: [Kind.Metadata] };
};

const makeDefaultEnrichedEvent = (evt: Event): IEnrichedEvent => {
  return {
    ...evt,
    name: "",
    about: "",
    picture: "",
    positive: { count: 0, events: [] },
    negative: { count: 0, events: [] }
  };
};

const assignUserMetadata = (evt: IEnrichedEvent, metadata: IUserMetadata): IEnrichedEvent => {
  return {
    ...evt,
    about: metadata.about,
    name: metadata.name,
    picture: metadata.picture
  };
};

const shrinkContent = (content: string, limit: number = 100): string => {
  if (content.length > limit) {
    return `${content.substring(0, limit)} ...`;
  }

  return content;
};

const parseDate = (eventDate: number): string => {
  const date = new Date(eventDate * 1000);
  return `${date.toTimeString().split(" ")[0]} ${date.toDateString()}`;
};

const getPublicKeyFromExt = async (): Promise<string> => {
  let pk = "";

  try {
    pk = await window.nostr.getPublicKey();
  } catch (error) {
    try {
      await new Promise((_) => setTimeout(_, 500));
      pk = await window.nostr.getPublicKey();
    } catch (error) {}
  }

  return pk;
};

export {
  createMetadataFilter,
  sortByCreatedAt,
  assignUserMetadata,
  shrinkContent,
  parseDate,
  makeDefaultEnrichedEvent,
  getPublicKeyFromExt
};
