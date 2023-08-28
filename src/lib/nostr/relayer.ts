import { Setter } from "solid-js";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { IReactionFields, Reaction } from "~/interfaces/IReaction";
import { IUserMetadata } from "~/interfaces/IUserMetadata";
import { createMetadataFilter, makeDefaultEnrichedEvent, sortByCreatedAt } from "./nostr-utils";
import {
  Event,
  EventTemplate,
  Filter,
  Kind,
  Pub,
  SimplePool,
  Sub,
  validateEvent,
  verifySignature
} from "nostr-tools";

class Relayer {
  public userPubKey?: string;
  public relayPool: SimplePool;
  public following: string[] = [];
  public relaysUrls: string[] = ["ws://localhost:2700"];

  private kindThreeEvent?: Event;

  constructor(userPubkey?: string) {
    this.relayPool = new SimplePool();
    this.userPubKey = userPubkey;
    this.fetchRelaysAndFollowers();
  }

  public fetchEvents(
    setIsLoading: Setter<boolean>,
    setEvents: Setter<Event[]>,
    setShowPopup?: Setter<boolean>,
    filter?: Filter
  ): void {
    let eose: boolean = false;

    const eventsSub: Sub = this.relayPool.sub(this.relaysUrls, filter ? [filter] : [{}]);
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
        const metadataSub: Sub = this.relayPool.sub(this.relaysUrls, [
          createMetadataFilter([enrichedEvent.pubkey])
        ]);

        metadataSub.on("event", (metaEvt: Event) => {
          const userMetadata: IUserMetadata = JSON.parse(metaEvt.content);

          if (evt.pubkey === metaEvt.pubkey) {
            enrichedEvent.name = userMetadata.name;
            enrichedEvent.about = userMetadata.about;
            enrichedEvent.picture = userMetadata.picture;
          }
        });

        metadataSub.on("eose", () => {
          const reactionsSub: Sub = this.relayPool.sub(this.relaysUrls, [
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
      const metadataSub: Sub = this.relayPool.sub(this.relaysUrls, [
        createMetadataFilter(events.map((e) => e.pubkey))
      ]);

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
          const reactionsSub: Sub = this.relayPool.sub(this.relaysUrls, [
            { kinds: [Kind.Reaction], "#e": [evt.id] }
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
  }

  public fetchUserEvents(setUserEvents: Setter<Event[]>, filter: Filter): void {
    const eventsSub: Sub = this.relayPool.sub(this.relaysUrls, [{ kinds: [Kind.Text], ...filter }]);

    let userEvents: Event[] = [];
    eventsSub.on("event", (evt: Event) => {
      userEvents.push(evt);
    });

    eventsSub.on("eose", () => {
      setUserEvents(userEvents);
      eventsSub.unsub();
    });
  }

  public async deleteEvent(eventID: string): Promise<void> {
    const deletionEvent: EventTemplate = {
      kind: Kind.EventDeletion,
      tags: [["e", eventID]],
      created_at: Math.floor(Date.now() / 1000),
      content: ""
    };

    const signedEvent = await window.nostr.signEvent(deletionEvent);
    const pubRes: Pub = this.relayPool.publish(this.relaysUrls, signedEvent);

    pubRes.on("ok", () => {
      console.log("event deleted");
    });

    pubRes.on("failed", () => {
      console.log("failure");
    });
  }

  public async reactToEvent(eventID: string, eventPubkey: string, reaction: Reaction): Promise<void> {
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

    /**
     * Should the reaction only be published to the relay the event was fetched from?
     * If so, IEnrichedEvent should also have a relay url prop
     */
    const pubRes: Pub = this.relayPool.publish(this.relaysUrls, signedEvent);

    pubRes.on("ok", () => {
      console.log("reaction sent");
    });

    pubRes.on("failed", () => {
      console.log("failure");
    });
  }

  public async fetchAndUnsubKindThreeEvent(): Promise<Event> {
    if (!this.userPubKey) {
      return new Promise((_) => {});
    }

    const kindThreeSub: Sub = this.relayPool.sub(this.relaysUrls, [
      { kinds: [Kind.Contacts], authors: [this.userPubKey] }
    ]);

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
  }

  public async followUser(newFollowing: string[]): Promise<void> {
    const followEvent: EventTemplate = {
      content: this.kindThreeEvent!.content,
      kind: Kind.Contacts,
      created_at: Math.floor(Date.now() / 1000),
      tags: newFollowing.map((pk) => ["p", pk])
    };

    const signedEvent = await window.nostr.signEvent(followEvent);
    const pubRes: Pub = this.relayPool.publish(this.relaysUrls, signedEvent);

    pubRes.on("ok", () => {
      // decide whether signal update should happen here or in `fetchUserFollowing` after EOSE
    });

    pubRes.on("failed", () => {
      console.log("follow event failure");
    });

    return;
  }

  public isUserAlreadyFollowed = (pubkey: string): boolean => {
    if (this.following.includes(pubkey)) {
      return true;
    }

    return false;
  };

  private fetchRelaysAndFollowers() {
    if (!this.userPubKey) {
      return;
    }

    const kindThreeSub: Sub = this.relayPool.sub(this.relaysUrls, [
      { kinds: [Kind.Contacts], authors: [this.userPubKey] }
    ]);

    // manage multiple events from multiple relays
    kindThreeSub.on("event", (evt: Event) => {
      this.kindThreeEvent = evt;
      this.following = evt.tags.map((e) => e[1]);

      const relayUrls = evt.content.split(";");
      if (relayUrls[0] !== "") {
        this.relaysUrls = relayUrls;
      }
    });
  }
}

export default Relayer;
