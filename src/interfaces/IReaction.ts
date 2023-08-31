type Reaction = "+" | "-";

interface IReactionFields {
  count: number;
  events: { pubkey: string; eventID: string }[];
}

interface IReaction {
  positive: IReactionFields;
  negative: IReactionFields;
}

interface IReactionWithEventID extends IReaction {
  eventID: string;
}

export { Reaction, IReaction, IReactionFields, IReactionWithEventID };
