import {
  Event,
  EventTemplate,
  Filter,
  Kind,
  Pub,
  Relay,
  SimplePool,
  Sub,
  validateEvent,
  verifySignature
} from "nostr-tools";
import { Accessor, Setter } from "solid-js";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { IUserMetadata } from "~/interfaces/IUserMetadata";
import { IReactionFields, Reaction } from "~/interfaces/IReaction";
import { createMetadataFilter, makeDefaultEnrichedEvent, sortByCreatedAt } from "./nostr-utils";

const deleteNostrEvent = async (relay: Relay, eventID: string): Promise<void> => {
  const deletionEvent: EventTemplate = {
    kind: Kind.EventDeletion,
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
  reaction: Reaction
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

const fetchEvents = (
  relay: SimplePool,
  relaysUrls: string[],
  setEvents: Setter<IEnrichedEvent[]>,
  setIsLoading: Setter<boolean>,
  filter?: Filter,
  setShowPopup?: Setter<boolean>
) => {
  let eose: boolean = false;

  const eventsSub: Sub = relay.sub(relaysUrls, filter ? [filter] : [{}]);
  const events: IEnrichedEvent[] = [];

  eventsSub.on("event", (evt: Event) => {
    if (!eose) {
      setIsLoading(true);
    }

    if (!eose && evt.kind === Kind.Text && validateEvent(evt) && verifySignature(evt)) {
      events.push(makeDefaultEnrichedEvent(evt));

      if (filter?.ids?.length == 1) {
        setEvents(events);
      }
    }

    /* Handle incoming events after all events have been received */
    if (eose) {
      const enrichedEvent: IEnrichedEvent = makeDefaultEnrichedEvent(evt);
      const metadataSub: Sub = relay.sub(relaysUrls, [createMetadataFilter([enrichedEvent.pubkey])]);

      metadataSub.on("event", (metaEvt: Event) => {
        const userMetadata: IUserMetadata = JSON.parse(metaEvt.content);

        if (evt.pubkey === metaEvt.pubkey) {
          enrichedEvent.name = userMetadata.name;
          enrichedEvent.about = userMetadata.about;
          enrichedEvent.picture = userMetadata.picture;
        }
      });

      metadataSub.on("eose", () => {
        const reactionsSub: Sub = relay.sub(relaysUrls, [
          { kinds: [Kind.Reaction], "#e": [enrichedEvent.id] }
        ]);
        const positive: IReactionFields = { count: 0, events: [] };
        const negative: IReactionFields = { count: 0, events: [] };

        reactionsSub.on("event", (reactionEvt: Event) => {
          switch (reactionEvt.content) {
            case "+":
              positive.count++;
              positive.events.push({ eventID: reactionEvt.id, pubkey: reactionEvt.pubkey });
              break;

            case "-":
              negative.count++;
              negative.events.push({ eventID: reactionEvt.id, pubkey: reactionEvt.pubkey });
              break;

            default:
              break;
          }
        });

        reactionsSub.on("eose", () => {
          if (positive.count != 0 || negative.count != 0) {
            enrichedEvent.positive = positive;
            enrichedEvent.negative = negative;
          }

          reactionsSub.unsub();
          events.push(enrichedEvent);

          if (enrichedEvent.kind == Kind.Text) {
            if (setShowPopup) {
              setShowPopup(true);
            }

            setEvents(events.sort(sortByCreatedAt));
          }
        });
      });
    }
  });

  eventsSub.on("eose", () => {
    // fetch and assign metadata
    const metadataSub: Sub = relay.sub(relaysUrls, [createMetadataFilter(events.map((e) => e.pubkey))]);

    metadataSub.on("event", (metaEvt: Event) => {
      const userMetadata: IUserMetadata = JSON.parse(metaEvt.content);

      events.forEach((evt: IEnrichedEvent) => {
        if (evt.pubkey === metaEvt.pubkey) {
          evt.name = userMetadata.name;
          evt.about = userMetadata.about;
          evt.picture = userMetadata.picture;
        }
      });
    });

    metadataSub.on("eose", () => {
      let parsedReactionEventsCount = 0;
      const eventsCount = events.length;

      // fetch and assign reactions
      events.forEach((evt: IEnrichedEvent) => {
        const reactionsSub: Sub = relay.sub(relaysUrls, [{ kinds: [Kind.Reaction], "#e": [evt.id] }]);
        const positive: IReactionFields = { count: 0, events: [] };
        const negative: IReactionFields = { count: 0, events: [] };

        reactionsSub.on("event", (reactionEvt: Event) => {
          switch (reactionEvt.content) {
            case "+":
              positive.count++;
              positive.events.push({ eventID: reactionEvt.id, pubkey: reactionEvt.pubkey });
              break;

            case "-":
              negative.count++;
              negative.events.push({ eventID: reactionEvt.id, pubkey: reactionEvt.pubkey });
              break;

            default:
              break;
          }
        });

        reactionsSub.on("eose", () => {
          if (filter?.ids?.length == 1 && positive.count == 0 && negative.count == 0) {
            setIsLoading(false);
          }

          if (positive.count != 0 || negative.count != 0) {
            evt.positive = positive;
            evt.negative = negative;
            setEvents(events.sort(sortByCreatedAt));
          }

          parsedReactionEventsCount++;
          if (parsedReactionEventsCount == eventsCount) {
            setIsLoading(false);
            eose = true;
          }

          reactionsSub.unsub();
        });
      });
    });
  });
};

// define optional filter to retrieve only most recent x events
const fetchUserEvents = (relay: Relay, pubkey: string, setUserEvents: Setter<Event[]>): void => {
  const eventsSub: Sub = relay.sub([{ authors: [pubkey], kinds: [Kind.Text] }]);

  let userEvents: Event[] = [];
  eventsSub.on("event", (evt: Event) => {
    userEvents.push(evt);
  });

  eventsSub.on("eose", () => {
    setUserEvents(userEvents);
  });
};

const fetchUserFollowing = async (
  relay: Relay,
  pubkey: string,
  setFollowing: Setter<string[]>
): Promise<Sub> => {
  const followingSub: Sub = relay.sub([{ kinds: [Kind.Contacts], authors: [pubkey] }]);

  followingSub.on("event", (evt: Event) => {
    setFollowing(evt.tags.map((e) => e[1]));
  });

  return await new Promise((res) => {
    followingSub.on("eose", () => res(followingSub));
  });
};

const fetchUserKindThreeEvent = async (relay: Relay, pubkey: string): Promise<Event> => {
  const kindThreeSub: Sub = relay.sub([{ kinds: [Kind.Contacts], authors: [pubkey] }]);

  let event: Event;

  kindThreeSub.on("event", (evt: Event) => {
    event = evt;
  });

  return await new Promise((res) => {
    kindThreeSub.on("eose", () => {
      kindThreeSub.unsub();
      res(event);
    });
  });
};

const fetchUserRelayUrls = async (
  relay: Relay,
  pubkey: string,
  setRelayUrls: Setter<string[]>
): Promise<void> => {
  const kindThreeSub: Sub = relay.sub([{ kinds: [Kind.Contacts], authors: [pubkey] }]);

  return await new Promise((res) => {
    kindThreeSub.on("event", (evt: Event) => {
      const relayUrls = evt.content.split(";");

      if (relayUrls[0] !== "") {
        setRelayUrls(relayUrls);
      }

      res();
    });
  });
};

const followUser = async (relay: Relay, newFollowing: string[]): Promise<void> => {
  const followEvent: EventTemplate = {
    content: "",
    kind: Kind.Contacts,
    created_at: Math.floor(Date.now() / 1000),
    tags: newFollowing.map((pk) => ["p", pk])
  };

  const signedEvent = await window.nostr.signEvent(followEvent);
  const pubRes: Pub = relay.publish(signedEvent);

  pubRes.on("ok", () => {
    // decide whether signal update should happen here or in `fetchUserFollowing` after EOSE
  });

  pubRes.on("failed", () => {
    console.log("follow event failure");
  });

  return;
};

const isUserAlreadyFollowed = (pubkey: string, following: Accessor<string[]>): boolean => {
  if (following().includes(pubkey)) {
    return true;
  }

  return false;
};

export {
  deleteNostrEvent,
  reactToEvent,
  fetchEvents,
  fetchUserFollowing,
  followUser,
  isUserAlreadyFollowed,
  fetchUserEvents,
  fetchUserKindThreeEvent,
  fetchUserRelayUrls
};
