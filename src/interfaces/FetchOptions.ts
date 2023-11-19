import { Filter } from "nostr-tools";
import { FeedSearchParams } from "~/types/FeedSearchParams";

export default interface FetchOptions {
  rootOnly: boolean;
  isAnchorsMode: boolean;
  filter: Filter;
  feedSearchParams?: FeedSearchParams;
  postFetchLimit?: number;
  specificRelays?: string[];
  fetchRepostEvents?: boolean;
}
