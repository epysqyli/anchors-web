import { Event } from "nostr-tools";
import { IUserMetadata } from "./IUserMetadata";

interface IEnrichedEvent extends IUserMetadata, Event {}

export default IEnrichedEvent;
