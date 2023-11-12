import { Event } from "nostr-tools";
import { IUserMetadata } from "./IUserMetadata";

export default interface EventWithMetadata extends Event, IUserMetadata {};