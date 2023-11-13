import { Event } from "nostr-tools";

interface PubResult {
  error: boolean;
  event: Event;
}

interface GenericPubResult<T> {
  error: boolean;
  data: T;
}

export { PubResult, GenericPubResult };
