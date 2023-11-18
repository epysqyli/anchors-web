import { IUserMetadata } from "./IUserMetadata";
import { IReaction } from "./IReaction";
import EventWithRepostInfo from "./EventWithRepostInfo";

interface IEnrichedEvent extends IUserMetadata, IReaction, EventWithRepostInfo {}

export default IEnrichedEvent;
