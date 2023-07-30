import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { IUserMetadata } from "~/interfaces/IUserMetadata";
import { Event, Filter, Kind } from "nostr-tools";
import { Setter } from "solid-js";

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
    positive: 0,
    negative: 0
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

const checkAndSetPublicKey = async (setPublicKey: Setter<string>): Promise<void> => {
  try {
    const pk = await window.nostr.getPublicKey();
    setPublicKey(pk);
  } catch (error) {
    await new Promise((_) => setTimeout(_, 500));
    const pk = await window.nostr.getPublicKey();
    setPublicKey(pk);
  }
};

export {
  createMetadataFilter,
  sortByCreatedAt,
  assignUserMetadata,
  shrinkContent,
  parseDate,
  checkAndSetPublicKey,
  makeDefaultEnrichedEvent
};
