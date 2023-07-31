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
  setIsLoading: Setter<boolean>,
  filter?: Filter,
  setShowPopup?: Setter<boolean>
) => {
  let eose: boolean = false;

  const eventsSub: Sub = relay.sub(filter ? [filter] : [{}]);
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
      const metadataSub: Sub = relay.sub([createMetadataFilter([enrichedEvent.pubkey])]);

      metadataSub.on("event", (metaEvt: Event) => {
        const userMetadata: IUserMetadata = JSON.parse(metaEvt.content);

        if (evt.pubkey === metaEvt.pubkey) {
          enrichedEvent.name = userMetadata.name;
          enrichedEvent.about = userMetadata.about;
          enrichedEvent.picture = userMetadata.picture;
        }
      });

      metadataSub.on("eose", () => {
        const reactionsSub: Sub = relay.sub([{ kinds: [Kind.Reaction], "#e": [enrichedEvent.id] }]);
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
      let parsedReactionEventsCount = 0;
      const eventsCount = events.length;

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
          if (filter?.ids?.length == 1 && positive == 0 && negative == 0) {
            setIsLoading(false);
          }

          if (positive != 0 || negative != 0) {
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

export { deleteNostrEvent, reactToEvent, fetchEvents };
