import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { IUserMetadata } from "~/interfaces/IUserMetadata";
import { Event, EventTemplate, Filter, Kind, Pub, Relay, UnsignedEvent } from "nostr-tools";

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

/**
 * functions implemeting NIPs should probably reside somewhere else
 * for example: delete, reactions, comments, repost ...
 */

const deleteNostrEvent = async (relay: Relay, eventID: string, pubkey: string): Promise<void> => {
  const deletionEvent: UnsignedEvent = {
    kind: Kind.EventDeletion,
    pubkey: pubkey,
    tags: [["e", eventID]],
    created_at: Math.floor(Date.now() / 1000),
    content: ""
  };

  const signedEvent = await window.nostr.signEvent(deletionEvent);
  const pubRes: Pub = relay.publish(signedEvent);

  pubRes.on("ok", () => {
    console.log("event deleted");
  });

  pubRes.on("failed", () => {
    console.log("failure");
  });
};

const reactToEvent = async (
  relay: Relay,
  eventID: string,
  eventPubkey: string,
  reaction: "+" | "-"
): Promise<void> => {
  const reactionEvent: EventTemplate = {
    kind: Kind.Reaction,
    tags: [
      ["e", eventID],
      ["p", eventPubkey]
    ],
    content: reaction,
    created_at: Math.floor(Date.now() / 1000)
  };

  const signedEvent = await window.nostr.signEvent(reactionEvent);
  const pubRes: Pub = relay.publish(signedEvent);

  pubRes.on("ok", () => {
    console.log("reaction sent");
  });

  pubRes.on("failed", () => {
    console.log("failure");
  });
};

export {
  createMetadataFilter,
  sortByCreatedAt,
  enrichEvent,
  shrinkContent,
  parseDate,
  deleteNostrEvent,
  reactToEvent
};
