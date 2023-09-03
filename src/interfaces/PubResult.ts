import { Event } from "nostr-tools";

export default interface PubResult {
  error: boolean;
  event: Event;
}
