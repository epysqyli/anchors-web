import { FiThumbsDown, FiThumbsUp } from "solid-icons/fi";
import { Accessor, Component, JSX, createMemo } from "solid-js";
import { IReaction, Reaction } from "~/interfaces/IReaction";

interface Props {
  publicKey: string;
  reactions: Accessor<IReaction>;
  handleReaction(reaction: Reaction): Promise<void>;
}

const Reactions: Component<Props> = (props): JSX.Element => {
  const hasUserReacted = (reactionType: "positive" | "negative"): boolean => {
    const userReaction = props.reactions()[reactionType as keyof IReaction].events.find(
      (evt) => evt.pubkey == props.publicKey
    );

    if (userReaction !== undefined) {
      return true;
    }

    return false;
  };

  const hasPositiveUserReaction = createMemo(() => hasUserReacted("positive"));
  const hasNegativeUserReaction = createMemo(() => hasUserReacted("negative"));

  return (
    <div class='flex items-center gap-x-2 text-slate-400'>
      <div
        onClick={() => props.handleReaction("+")}
        class='cursor-pointer hover:text-slate-200 hover:scale-105 active:scale-95 transition-all'
      >
        <FiThumbsUp
          size={26}
          fill={hasPositiveUserReaction() ? "white" : ""}
          fill-opacity={hasPositiveUserReaction() ? "0.7" : "0"}
        />
        <p class='text-center text-sm mt-1'>{props.reactions().positive.count}</p>
      </div>
      <div
        onClick={() => props.handleReaction("-")}
        class='cursor-pointer hover:text-slate-200 hover:scale-105 active:scale-95 transition-all'
      >
        <FiThumbsDown
          size={26}
          fill={hasNegativeUserReaction() ? "white" : ""}
          fill-opacity={hasNegativeUserReaction() ? "0.7" : "0"}
        />
        <p class='text-center text-sm mt-1'>{props.reactions().negative.count}</p>
      </div>
    </div>
  );
};

export default Reactions;
