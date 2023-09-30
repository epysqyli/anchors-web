import { Event } from "nostr-tools";
import { sortByCreatedAtReverse } from "./nostr-utils";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";

export interface CommentTree {
  event: { data: IEnrichedEvent; comments: CommentTree[] };
}

class EventComments {
  private rootEvent: IEnrichedEvent;
  private incomingComments: IEnrichedEvent[];

  public structure: CommentTree;

  constructor(rootEvent: IEnrichedEvent, comments: IEnrichedEvent[]) {
    this.rootEvent = rootEvent;

    this.incomingComments = comments.sort(sortByCreatedAtReverse).map((evt) => {
      return this.normalizePositionalTags(this.discardIntermediateTags(evt));
    });

    this.structure = { event: { data: this.rootEvent, comments: [] } };
    this.assignComments(this.structure);
  }

  private isPositionalComment(evt: Event): boolean {
    const eTags = evt.tags.filter((t) => t[0] == "e");
    let isPositionalEventTag: boolean = true;

    for (let i = 0; i < eTags.length; i++) {
      if (eTags[i].length !== 2) {
        isPositionalEventTag = false;
        break;
      }
    }

    return isPositionalEventTag;
  }

  private discardIntermediateTags(evt: IEnrichedEvent): IEnrichedEvent {
    const eTags: string[][] = evt.tags.filter((t) => t[0] == "e");

    if (eTags.length > 2) {
      if (this.isPositionalComment(evt)) {
        const filteredETags: string[][] =
          eTags.length == 1 ? [eTags[0]] : [eTags[0], eTags[eTags.length - 1]];
        evt.tags = [...evt.tags.filter((t) => t[0] != "e"), ...filteredETags];
      } else {
        const filteredETags: string[][] = evt.tags.filter((t) => t[0] == "e" && t[3] != "mention");
        evt.tags = [...evt.tags.filter((t) => t[0] != "e"), ...filteredETags];
      }
    }

    return evt;
  }

  private normalizePositionalTags(evt: IEnrichedEvent): IEnrichedEvent {
    const eTags: string[][] = evt.tags.filter((t) => t[0] == "e");

    evt.tags = [
      ...evt.tags.filter((t) => t[0] != "e"),
      ...eTags.map((t) => (t[1] == this.rootEvent.id ? ["e", t[1], "", "root"] : ["e", t[1], "", "reply"]))
    ];

    return evt;
  }

  private selectRootComments(): IEnrichedEvent[] {
    return this.incomingComments.filter((evt) => {
      return evt.tags.filter((t) => t[0] == "e").length == 1;
    });
  }

  private selectReplyComments(targetEvtID: string): IEnrichedEvent[] {
    return this.incomingComments.filter((evt) => {
      return this.replyTagEventID(evt) == targetEvtID;
    });
  }

  private replyTagEventID(evt: Event): string | undefined {
    const replyTag = evt.tags.find((t) => t[0] == "e" && t[3] == "reply");

    if (replyTag) {
      return replyTag[1];
    }
  }

  private selectNextComments(targetEvtID: string): IEnrichedEvent[] {
    let nextComments: IEnrichedEvent[] = [];

    if (targetEvtID == this.rootEvent.id) {
      nextComments = this.selectRootComments();
    } else {
      nextComments = this.selectReplyComments(targetEvtID);
    }

    if (nextComments) {
      nextComments.forEach((evt) => {
        const eventIndex = this.incomingComments.findIndex((cmt) => cmt.id == evt.id);
        this.incomingComments.splice(eventIndex, 1);
      });
    }

    return nextComments;
  }

  private assignComments(node: CommentTree): void {
    this.selectNextComments(node.event.data.id).forEach((c) => {
      node.event.comments.push({ event: { data: c, comments: [] } });
      node.event.comments.forEach((nextNode) => this.assignComments(nextNode));
    });
  }
}

export default EventComments;
