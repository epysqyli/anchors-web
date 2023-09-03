import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { IReactionWithEventID, Reaction } from "~/interfaces/IReaction";
import { IUserMetadata, IUserMetadataWithPubkey } from "~/interfaces/IUserMetadata";
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
import { sortByCreatedAt } from "./nostr-utils";
import { Setter } from "solid-js";
import PubResult from "~/interfaces/PubResult";

class Relayer {
  public readonly FETCH_INTERVAL_MS = 20000;

  public userPubKey?: string;
  public following: string[] = [];
  public relaysUrls: string[] = ["ws://localhost:2700"];

  private kindThreeEvent?: Event;

  constructor(userPubkey?: string) {
    this.userPubKey = userPubkey;
    this.setRelaysAndFollowers();
  }

  public sub(filter: Filter): Sub {
    const pool = new SimplePool();

    const sub = pool.sub(this.relaysUrls, [filter]);
    pool.close(this.relaysUrls);

    return sub;
  }

  public pub(event: Event, relays?: string[]): Pub {
    const pool = new SimplePool();

    const destRelays: string[] = relays == undefined ? this.relaysUrls : relays;
    const pub = pool.publish(destRelays, event);
    pool.close(destRelays);

    return pub;
  }

  public async deleteEvent(eventID: string): Promise<PubResult> {
    const deletionEvent: EventTemplate = {
      kind: Kind.EventDeletion,
      tags: [["e", eventID]],
      created_at: Math.floor(Date.now() / 1000),
      content: ""
    };

    const signedEvent = await window.nostr.signEvent(deletionEvent);
    const pool = new SimplePool();
    const pubRes: Pub = pool.publish(this.relaysUrls, signedEvent);

    return await new Promise<PubResult>((res) => {
      pubRes.on("ok", () => {
        pool.close(this.relaysUrls);
        res({ error: false, event: signedEvent });
      });

      pubRes.on("failed", () => {
        pool.close(this.relaysUrls);
        res({ error: true, event: signedEvent });
      });
    });
  }

  /**
   * Should the reaction only be published to the relay the event was fetched from?
   * If so, IEnrichedEvent should also have a relay url prop
   */
  public async reactToEvent(eventID: string, eventPubkey: string, reaction: Reaction): Promise<PubResult> {
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
    const pool = new SimplePool();
    const pub = pool.publish([this.relaysUrls[0]], signedEvent);

    return await new Promise<PubResult>((res) => {
      pub.on("ok", () => {
        pool.close(this.relaysUrls);
        res({ error: false, event: signedEvent });
      });

      pub.on("failed", () => {
        pool.close(this.relaysUrls);
        res({ error: true, event: signedEvent });
      });
    });
  }

  public async fetchAndUnsubKindThreeEvent(): Promise<Event> {
    if (!this.userPubKey) {
      return new Promise((_) => {});
    }

    const pool = new SimplePool();

    const kindThreeSub: Sub = pool.sub(this.relaysUrls, [
      { kinds: [Kind.Contacts], authors: [this.userPubKey] }
    ]);

    let event: Event;

    kindThreeSub.on("event", (evt: Event) => {
      event = evt;
    });

    return await new Promise((res) => {
      kindThreeSub.on("eose", () => {
        kindThreeSub.unsub();
        pool.close(this.relaysUrls);
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
    const pool = new SimplePool();
    const pubRes: Pub = pool.publish(this.relaysUrls, signedEvent);

    pubRes.on("ok", () => {
      // decide whether signal update should happen here or in `fetchUserFollowing` after EOSE
    });

    pubRes.on("failed", () => {
      console.log("follow event failure");
    });

    pool.close(this.relaysUrls);
    return;
  }

  public isUserAlreadyFollowed = (pubkey: string): boolean => {
    if (this.following.includes(pubkey)) {
      return true;
    }

    return false;
  };

  public async setRelaysAndFollowersAsync(): Promise<void> {
    if (!this.userPubKey) {
      return;
    }

    const pool = new SimplePool();

    const kindThreeEvent = await pool.list(this.relaysUrls, [
      { kinds: [Kind.Contacts], authors: [this.userPubKey] }
    ]);

    // manage multiple events from multiple relays
    this.kindThreeEvent = kindThreeEvent[0];
    this.following = this.kindThreeEvent.tags.map((e) => e[1]);

    const relayUrls = this.kindThreeEvent.content.split(";");
    if (relayUrls[0] !== "") {
      this.relaysUrls = relayUrls;
    }

    pool.close(this.relaysUrls);
  }

  public async fetchTextEvents(filter?: Filter): Promise<Event[]> {
    const pool = new SimplePool();
    filter = filter == undefined ? { kinds: [Kind.Text] } : { ...filter, kinds: [Kind.Text] };
    const events = (await pool.list(this.relaysUrls, [filter])).filter(this.isEventValid);
    pool.close(this.relaysUrls);

    return events;
  }

  public async fetchEventsMetadata(filter: Filter): Promise<IUserMetadataWithPubkey[]> {
    const pool = new SimplePool();
    const events = (await pool.list(this.relaysUrls, [{ ...filter, kinds: [Kind.Metadata] }])).filter(
      this.isEventValid
    );

    const metadataEvents: IUserMetadataWithPubkey[] = events.map((evt) => {
      const metadata: IUserMetadata = JSON.parse(evt.content);
      return { name: metadata.name, picture: metadata.picture, about: metadata.about, pubkey: evt.pubkey };
    });

    pool.close(this.relaysUrls);

    return metadataEvents;
  }

  public async fetchEventsReactions(filter: Filter[]): Promise<IReactionWithEventID[]> {
    const pool = new SimplePool();
    const events = (await pool.list(this.relaysUrls, filter)).filter(this.isEventValid);
    pool.close(this.relaysUrls);

    const eventdIDs = filter.flatMap((f) => f["#e"]);

    return eventdIDs.map((evtID) => {
      const reactionEvents = events.filter((re) => {
        const reactionEventIDTag = re.tags.find((t) => t[0] == "e");
        return reactionEventIDTag && reactionEventIDTag[1] == evtID;
      });

      const reactionWithEventID: IReactionWithEventID = {
        eventID: evtID,
        positive: { count: 0, events: [] },
        negative: { count: 0, events: [] }
      };

      reactionEvents.forEach((re) => {
        if (re.content == "+") {
          reactionWithEventID.positive.count += 1;
          reactionWithEventID.positive.events.push({ eventID: re.id, pubkey: re.pubkey });
        } else {
          (reactionWithEventID.negative.count += 1),
            reactionWithEventID.negative.events.push({ eventID: re.id, pubkey: re.pubkey });
        }
      });

      return reactionWithEventID;
    });
  }

  public buildEnrichedEvents(
    events: Event[],
    metadata: IUserMetadataWithPubkey[],
    reactions: IReactionWithEventID[]
  ): IEnrichedEvent[] {
    return events
      .map((evt) => {
        const enrichedEvent: IEnrichedEvent = {
          ...evt,
          name: "",
          about: "",
          picture: "",
          positive: { count: 0, events: [] },
          negative: { count: 0, events: [] }
        };

        const metaEvent = metadata.find((metaEvt) => metaEvt.pubkey == evt.pubkey);
        if (metaEvent) {
          enrichedEvent.name = metaEvent.name;
          enrichedEvent.about = metaEvent.about;
          enrichedEvent.picture = metaEvent.picture;
        }

        const reactionEvent = reactions.find((re) => re.eventID == evt.id);
        if (reactionEvent) {
          enrichedEvent.positive = reactionEvent.positive;
          enrichedEvent.negative = reactionEvent.negative;
        }

        return enrichedEvent;
      })
      .sort(sortByCreatedAt);
  }

  private setRelaysAndFollowers(): void {
    if (!this.userPubKey) {
      return;
    }

    const pool = new SimplePool();

    const kindThreeSub: Sub = pool.sub(this.relaysUrls, [
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

    pool.close(this.relaysUrls);
  }

  private isEventValid(event: Event): boolean {
    return validateEvent(event) && verifySignature(event);
  }
}

export default Relayer;
