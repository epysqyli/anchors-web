import { Reaction } from "~/interfaces/IReaction";
import {
  Event,
  EventTemplate,
  Filter,
  Kind,
  Pub,
  Relay,
  Sub,
  validateEvent,
  verifySignature
} from "nostr-tools";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { Setter } from "solid-js";
import { createMetadataFilter, makeDefaultEnrichedEvent, sortByCreatedAt } from "./nostr-utils";
import { IUserMetadata } from "~/interfaces/IUserMetadata";

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
  relay: Relay,
  setEvents: Setter<IEnrichedEvent[]>,
  setShowPopup: Setter<boolean>,
  setIsLoading: Setter<boolean>
) => {
  const filters: Filter[] = [{}];
  const eventsSub: Sub = relay.sub(filters);

  const events: IEnrichedEvent[] = [];
  // let eose: boolean = false;

  eventsSub.on("event", (evt: Event) => {
    if (evt.kind === Kind.Text && validateEvent(evt) && verifySignature(evt)) {
      events.push(makeDefaultEnrichedEvent(evt));
    }
  });

  eventsSub.on("eose", () => {
    // fetch and assign metadata
    const metadataSub: Sub = relay.sub([createMetadataFilter(events.map((e) => e.pubkey))]);

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
      // fetch and assign reactions
      events.forEach((evt: IEnrichedEvent) => {
        const reactionsSub: Sub = relay.sub([{ kinds: [Kind.Reaction], "#e": [evt.id] }]);
        let positive = 0;
        let negative = 0;

        reactionsSub.on("event", (reactionEvt: Event) => {
          switch (reactionEvt.content) {
            case "+":
              positive++;
              break;

            case "-":
              negative++;
              break;

            default:
              break;
          }
        });

        reactionsSub.on("eose", () => {
          if (positive != 0 || negative != 0) {
            evt.positive = positive;
            evt.negative = negative;
            setEvents(events.sort(sortByCreatedAt));
          }

          reactionsSub.unsub();
        });
      });
    });
  });
};

export { deleteNostrEvent, reactToEvent, fetchEvents };
