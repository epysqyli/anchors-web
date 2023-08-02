type Reaction = "+" | "-";

interface IReactionFields {
  count: number;
  events: { pubkey: string; eventID: string }[];
}

interface IReaction {
  positive: IReactionFields;
  negative: IReactionFields;
}

export { Reaction, IReaction, IReactionFields };
