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
import PubResult from "~/interfaces/PubResult";
import RelayList from "~/interfaces/RelayList";

class Relayer {
  public readonly FETCH_INTERVAL_MS = 20000;

  public userPubKey?: string;
  public following: string[] = [];
  private relays: RelayList = { r: [], w: [], rw: [] };

  constructor(userPubkey?: string) {
    this.userPubKey = userPubkey;
  }

  public sub(filter: Filter): Sub {
    const pool = new SimplePool();
    const sub = pool.sub(this.getReadRelays(), [filter]);
    pool.close(this.getReadRelays());

    return sub;
  }

  public pub(event: Event): Pub {
    const pool = new SimplePool();
    const pub = pool.publish(this.getWriteRelays(), event);
    pool.close(this.getWriteRelays());

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
    this.pub(signedEvent);

    return { error: false, event: signedEvent };
    /**
     * awaiting here never resolves for some reason
     * the same pattern works on this.reactToEvent though!
     * try out different relays or change basic relayer implementation
     * perhaps `advancedDeleter` is interfering
     */
    // return await new Promise<PubResult>((res) => {
    //   pub.on("ok", () => {
    //     res({ error: false, event: signedEvent });
    //   });

    //   pub.on("failed", () => {
    //     res({ error: true, event: signedEvent });
    //   });
    // });
  }

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
    const pub = this.pub(signedEvent);

    return await new Promise<PubResult>((res) => {
      pub.on("ok", () => {
        res({ error: false, event: signedEvent });
      });

      pub.on("failed", () => {
        res({ error: true, event: signedEvent });
      });
    });
  }

  public async fetchFollowingAndRelays(): Promise<Event | undefined> {
    if (!this.userPubKey) {
      return new Promise((_) => {});
    }

    const pool = new SimplePool();

    const kindThreeEvts = await pool.list(this.getReadRelays(), [
      { kinds: [Kind.Contacts], authors: [this.userPubKey] }
    ]);

    pool.close(this.getReadRelays());

    if (kindThreeEvts.length != 0) {
      return kindThreeEvts[0];
    }

    return undefined;
  }

  public async fetchAndSetRelays(): Promise<RelayList> {
    if (this.isRelayListEmpty()) {
      this.relays.rw.push(import.meta.env.VITE_DEFAULT_RELAY);
    }

    const pool = new SimplePool();
    const events: Event[] = await pool.list(this.getReadRelays(), [
      {
        kinds: [Kind.RelayList],
        authors: [this.userPubKey!]
      }
    ]);

    if (events.length != 0) {
      const relays = events.map((evt) => evt.tags).flat();

      relays.forEach((relay) => {
        switch (relay.length) {
          case 2:
            const found = this.relays.rw.find((r) => r == relay[1]);
            if (!this.relays.rw.find((r) => r == relay[1])) {
              this.relays.rw.push(relay[1]);
            }
            break;

          case 3:
            switch (relay[2]) {
              case "read":
                if (!this.relays.r.find((r) => r == relay[1])) {
                  this.relays.r.push(relay[1]);
                }
                break;

              case "write":
                if (!this.relays.w.find((r) => r == relay[1])) {
                  this.relays.w.push(relay[1]);
                }
                break;

              default:
                break;
            }
            break;

          default:
            break;
        }
      });
    }

    return this.relays;
  }

  public async followUser(newFollowing: string[]): Promise<PubResult> {
    const followEvent: EventTemplate = {
      content: "",
      kind: Kind.Contacts,
      created_at: Math.floor(Date.now() / 1000),
      tags: newFollowing.map((pk) => ["p", pk])
    };

    const signedEvent = await window.nostr.signEvent(followEvent);
    const pub = this.pub(signedEvent);

    return await new Promise<PubResult>((res) => {
      pub.on("ok", () => {
        this.following = signedEvent.tags.map((pk) => pk[1]);
        res({ error: false, event: signedEvent });
      });

      pub.on("failed", () => {
        res({ error: true, event: signedEvent });
      });
    });
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

    const kindThreeEvents = await pool.list(this.getReadRelays(), [
      { kinds: [Kind.Contacts], authors: [this.userPubKey] }
    ]);

    // manage multiple events from multiple relays
    this.following = kindThreeEvents[0].tags.map((e) => e[1]);

    if (this.isRelayListEmpty()) {
      kindThreeEvents[0].content.split(";").forEach((rl) => {
        this.relays.rw.push(rl);
      });
    }

    pool.close(this.getReadRelays());
  }

  public async fetchTextEvents(filter: Filter, rootOnly: boolean = false): Promise<Event[]> {
    const pool = new SimplePool();
    filter = { ...filter, kinds: [Kind.Text] };
    const events = (await pool.list(this.getReadRelays(), [filter])).filter(this.isEventValid);
    pool.close(this.getReadRelays());

    return rootOnly ? this.getRootTextEvents(events) : events;
  }

  public async fetchEventsMetadata(filter: Filter): Promise<IUserMetadataWithPubkey[]> {
    const pool = new SimplePool();
    const events = (await pool.list(this.getReadRelays(), [{ ...filter, kinds: [Kind.Metadata] }])).filter(
      this.isEventValid
    );

    const metadataEvents: IUserMetadataWithPubkey[] = events.map((evt) => {
      const metadata: IUserMetadata = JSON.parse(evt.content);
      return { name: metadata.name, picture: metadata.picture, about: metadata.about, pubkey: evt.pubkey };
    });

    pool.close(this.getReadRelays());

    return metadataEvents;
  }

  public async fetchEventsReactions(filter: Filter[]): Promise<IReactionWithEventID[]> {
    const pool = new SimplePool();
    const events = (await pool.list(this.getReadRelays(), filter)).filter(this.isEventValid);
    pool.close(this.getReadRelays());

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

  private isEventValid(event: Event): boolean {
    return validateEvent(event) && verifySignature(event);
  }

  private getReadRelays(): string[] {
    return [...this.relays.r, ...this.relays.rw];
  }

  private getWriteRelays(): string[] {
    return [...this.relays.w, ...this.relays.rw];
  }

  private isRelayListEmpty(): boolean {
    if (this.relays.r.length + this.relays.w.length + this.relays.rw.length == 0) {
      return true;
    }

    return false;
  }

  private getRootTextEvents(events: Event[]): Event[] {
    return events.filter((evt) => evt.tags.filter((t) => t[0] == "e").length == 0);
  }
}

export default Relayer;
