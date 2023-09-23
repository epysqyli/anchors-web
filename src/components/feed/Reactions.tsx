import { RelayContext } from "~/contexts/relay";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { handleReaction } from "~/lib/nostr/nostr-utils";
import { FiThumbsDown, FiThumbsUp } from "solid-icons/fi";
import { IReaction, Reaction } from "~/interfaces/IReaction";
import { Component, JSX, createMemo, createSignal, useContext } from "solid-js";

interface Props {
  event: IEnrichedEvent;
}

const Reactions: Component<Props> = (props): JSX.Element => {
  const { relay } = useContext(RelayContext);

  const [reactions, setReactions] = createSignal<IReaction>({
    positive: props.event.positive,
    negative: props.event.negative
  });

  const hasUserReacted = (reactionType: "positive" | "negative"): boolean => {
    const userReaction = reactions()[reactionType as keyof IReaction].events.find(
      (evt) => evt.pubkey == relay.userPubKey
    );

    if (userReaction !== undefined) {
      return true;
    }

    return false;
  };

  const hasPositiveUserReaction = createMemo(() => hasUserReacted("positive"));
  const hasNegativeUserReaction = createMemo(() => hasUserReacted("negative"));

  const reactToEvent = async (reaction: Reaction): Promise<void> => {
    await handleReaction(props.event, reactions, setReactions, reaction, relay);
  };

  return (
    <div class='flex items-center gap-x-2 text-slate-400'>
      <div
        onClick={() => reactToEvent("+")}
        class='cursor-pointer hover:text-slate-200 hover:scale-105 active:scale-95 transition-all'
      >
        <FiThumbsUp
          size={26}
          fill={hasPositiveUserReaction() ? "white" : ""}
          fill-opacity={hasPositiveUserReaction() ? "0.7" : "0"}
        />
        <p class='text-center text-sm mt-1'>{reactions().positive.count}</p>
      </div>
      <div
        onClick={() => reactToEvent("-")}
        class='cursor-pointer hover:text-slate-200 hover:scale-105 active:scale-95 transition-all'
      >
        <FiThumbsDown
          size={26}
          fill={hasNegativeUserReaction() ? "white" : ""}
          fill-opacity={hasNegativeUserReaction() ? "0.7" : "0"}
        />
        <p class='text-center text-sm mt-1'>{reactions().negative.count}</p>
      </div>
    </div>
  );
};

export default Reactions;
