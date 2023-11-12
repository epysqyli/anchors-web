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
import { FeedSearchParams } from "~/types/FeedSearchParams";

interface FetchOptions {
  rootOnly: boolean;
  isAnchorsMode: boolean;
  filter: Filter;
  feedSearchParams?: FeedSearchParams;
  postFetchLimit?: number;
}

class Relayer {
  public readonly FETCH_INTERVAL_MS = 20000;
  public readonly ALL_RELAYS_IDENTIFIER = "all";
  public readonly ANCHORS_EVENT_RTAG_IDENTIFIER = "anchors-event";

  public userPubKey?: string;
  public following: string[] = [];

  private relays: RelayList = { r: [], w: [], rw: [] };
  private currentPool: SimplePool;

  constructor(userPubkey?: string) {
    this.userPubKey = userPubkey;
    this.currentPool = new SimplePool();
  }

  public sub(filter: Filter): Sub {
    const sub = this.currentPool.sub(this.getReadRelays(), [filter]);
    return sub;
  }

  public pub(event: Event): Pub {
    const pub = this.currentPool.publish(this.getWriteRelays(), event);
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

  public async replyToEvent(content: string, replyEvent: Event, rootEvent: Event): Promise<PubResult> {
    let tags: string[][] = [];

    if (replyEvent.id == rootEvent.id) {
      tags = [
        ["e", rootEvent.id, "", "root"],
        ["p", rootEvent.pubkey]
      ];
    } else {
      tags = [
        ["e", rootEvent.id, "", "root"],
        ["e", replyEvent.id, "", "reply"],
        ["p", rootEvent.pubkey],
        ["p", replyEvent.pubkey]
      ];
    }

    const reply: EventTemplate = {
      content: content,
      created_at: Math.floor(Date.now() / 1000),
      kind: Kind.Text,
      tags: tags
    };

    const signedEvent = await window.nostr.signEvent(reply);
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

  public async fetchContacts(): Promise<string[]> {
    if (!this.userPubKey) {
      return new Promise((_) => []);
    }

    const contactEvents = await this.currentPool.list(this.getReadRelays(), [
      { kinds: [Kind.Contacts], authors: [this.userPubKey] }
    ]);

    const contactList: string[] = [];

    if (contactEvents.length != 0) {
      contactEvents.forEach((ce) => {
        ce.tags
          .map((t) => t[1])
          .forEach((pk) => {
            if (!contactList.includes(pk)) {
              contactList.push(pk);
            }
          });
      });
    }

    return contactList;
  }

  public async fetchAndSetRelays(): Promise<RelayList> {
    if (this.isRelayListEmpty()) {
      this.relays.rw.push(import.meta.env.VITE_DEFAULT_RELAY);
    }

    const relayListEvents: Event[] = await this.currentPool.list(this.getReadRelays(), [
      {
        kinds: [Kind.RelayList],
        authors: [this.userPubKey!]
      }
    ]);

    if (relayListEvents.length != 0) {
      const relays = relayListEvents.map((evt) => evt.tags).flat();

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

  public async fetchUserMetadata(): Promise<IUserMetadata | null> {
    const metadataEvents: Event[] = await this.currentPool.list(this.getReadRelays(), [
      { kinds: [Kind.Metadata], authors: [this.userPubKey!] }
    ]);

    if (metadataEvents.length == 0) {
      return null;
    }

    return JSON.parse(metadataEvents[0].content);
  }

  public isUserAlreadyFollowed = (pubkey: string): boolean => {
    if (this.following.includes(pubkey)) {
      return true;
    }

    return false;
  };

  public async fetchTextEvents(options: FetchOptions): Promise<Event[]> {
    let filter: Filter = { ...options.filter, kinds: [Kind.Text] };

    if (options.isAnchorsMode) {
      filter = { ...filter, "#r": [this.ANCHORS_EVENT_RTAG_IDENTIFIER] };
    }

    let rTag: string = "";
    if (options.filter["#r"] && options.filter["#r"].length != 0) {
      rTag = decodeURIComponent(options.filter["#r"][0]);
    }

    if (rTag) {
      filter = { ...filter, "#r": [rTag] };
    }

    if (options.feedSearchParams?.following == "on") {
      filter = { ...filter, authors: this.following };
    }

    let readFromRelays: string[] = this.getReadRelays();

    if (
      options.feedSearchParams?.relayAddress &&
      options.feedSearchParams?.relayAddress != this.ALL_RELAYS_IDENTIFIER
    ) {
      readFromRelays = [options.feedSearchParams.relayAddress];
    }

    const events = (await this.currentPool.list(readFromRelays, [filter])).filter(this.isEventValid);

    if (options.rootOnly && options.postFetchLimit) {
      return this.getRootTextEvents(events).slice(0, options.postFetchLimit);
    }

    if (options.rootOnly) {
      return this.getRootTextEvents(events);
    }

    return events;
  }

  public async fetchEventsMetadata(filter: Filter): Promise<IUserMetadataWithPubkey[]> {
    const events = (
      await this.currentPool.list(this.getReadRelays(), [{ ...filter, kinds: [Kind.Metadata] }])
    ).filter(this.isEventValid);

    const metadataEvents: IUserMetadataWithPubkey[] = events.map((evt) => {
      const metadata: IUserMetadata = JSON.parse(evt.content);
      return { name: metadata.name, picture: metadata.picture, about: metadata.about, pubkey: evt.pubkey };
    });

    return metadataEvents;
  }

  public async fetchEventsReactions(filter: Filter[]): Promise<IReactionWithEventID[]> {
    const events = (await this.currentPool.list(this.getReadRelays(), filter)).filter(this.isEventValid);
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

  public async fetchComments(rootEventID: string): Promise<IEnrichedEvent[]> {
    const filter = { "#e": [rootEventID], kinds: [Kind.Text] };
    const comments = (await this.currentPool.list(this.getReadRelays(), [filter])).filter(this.isEventValid);

    const metadata = await this.fetchEventsMetadata({
      authors: [...new Set(comments.map((evt) => evt.pubkey))]
    });

    const reactionsFilter: Filter[] = comments.map((evt) => {
      return { kinds: [Kind.Reaction], "#e": [evt.id] };
    });

    const reactions = await this.fetchEventsReactions(reactionsFilter);

    return this.buildEnrichedEvents(comments, metadata, reactions);
  }

  public getReadRelays(): string[] {
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

  private isEventValid(event: Event): boolean {
    return validateEvent(event) && verifySignature(event);
  }
}

export default Relayer;
