import { Event } from "nostr-tools";

export default interface EventWithRepostInfo extends Event {
  isRepost: boolean;
  repostEvent?: Event;
}
