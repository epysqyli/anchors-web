import { Event } from "nostr-tools";
import { IUserMetadata } from "./IUserMetadata";
import { IReaction } from "./IReaction";

interface IEnrichedEvent extends IUserMetadata, IReaction, Event {}

export default IEnrichedEvent;
