import { Event, Filter, Kind, relayInit } from "nostr-tools";
import { Accessor, Setter } from "solid-js";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { IReaction, IReactionFields, Reaction } from "~/interfaces/IReaction";
import { IUserMetadata } from "~/interfaces/IUserMetadata";
import Relayer from "./relayer";

const sortByCreatedAt = (evt1: Event, evt2: Event) => {
  return evt1.created_at > evt2.created_at ? -1 : 1;
};

const sortByCreatedAtReverse = (evt1: Event, evt2: Event) => {
  return evt1.created_at > evt2.created_at ? 1 : -1;
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
    negative: { count: 0, events: [] },
    isRepost: false
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
  if (!content) {
    return "";
  }

  if (content.length > limit) {
    return `${content.substring(0, limit)} ...`;
  }

  return content;
};

const parseDate = (eventDate: number): string => {
  const date = new Date(eventDate * 1000);
  return `${date.toTimeString().split(" ")[0]} ${date.toDateString()}`;
};

const handleReaction = async (
  event: Event,
  reactions: Accessor<IReaction>,
  setReactions: Setter<IReaction>,
  reaction: Reaction,
  relay: Relayer
): Promise<void> => {
  let reactionType = "";
  if (reaction == "+") {
    reactionType = "positive";
  } else if (reaction == "-") {
    reactionType = "negative";
  }

  const eventToDelete = reactions()[reactionType as keyof IReaction].events.find(
    (evt) => evt.pubkey === relay.userPubKey
  );

  if (eventToDelete) {
    const pubResult = await relay.deleteEvent(eventToDelete.eventID);

    if (pubResult.error) {
      console.log("Reaction not sent correctly");
      return;
    }

    const newReactions: IReactionFields = {
      count: reactions()[reactionType as keyof IReaction].count - 1,
      events: reactions()[reactionType as keyof IReaction].events.filter(
        (e) => e.eventID !== eventToDelete.eventID
      )
    };

    setReactions({ ...reactions(), [reactionType]: newReactions });
  } else {
    const pubResult = await relay.reactToEvent(event.id, event.pubkey, reaction);

    if (pubResult.error) {
      console.log("Reaction not sent correctly");
      return;
    }

    const newReactions: IReactionFields = {
      count: reactions()[reactionType as keyof IReaction].count + 1,
      events: [
        ...reactions()[reactionType as keyof IReaction].events,
        { pubkey: pubResult.data.pubkey, eventID: pubResult.data.id }
      ]
    };

    setReactions({ ...reactions(), [reactionType]: newReactions });
  }
};

const isRelayReachable = async (relayUrl: string): Promise<boolean> => {
  const relay = relayInit(relayUrl);

  try {
    await relay.connect();
  } catch (error) {
    return false;
  }

  return true;
};

export {
  createMetadataFilter,
  sortByCreatedAt,
  assignUserMetadata,
  shrinkContent,
  parseDate,
  makeDefaultEnrichedEvent,
  sortByCreatedAtReverse,
  handleReaction,
  isRelayReachable
};
