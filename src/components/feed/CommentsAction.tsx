import { useIsNarrow } from "~/hooks/useMediaQuery";
import { VsCommentDiscussion } from "solid-icons/vs";
import { Accessor, Component, JSX, Show } from "solid-js";

interface Props {
  isLoading: Accessor<boolean>;
  openCommentsPopup(): void;
  commentsCount: Accessor<number>;
}

const CommentsActions: Component<Props> = (props): JSX.Element => {
  return (
    <>
      <Show when={useIsNarrow() != undefined && useIsNarrow()}>
        <Show
          when={!props.isLoading()}
          fallback={
            <div class='relative rounded py-5 w-1/12 animate-pulse'>
              <VsCommentDiscussion class='text-slate-500 mx-auto' size={28} />
            </div>
          }
        >
          <div
            onClick={props.openCommentsPopup}
            class='relative rounded hover:bg-slate-600 active:bg-slate-700 px-2'
          >
            <VsCommentDiscussion class='text-slate-400 mx-auto' size={22} />
            <div class='text-sm text-center text-slate-400 tracking-tighter mt-1'>
              {props.commentsCount()}
            </div>
          </div>
        </Show>
      </Show>

      <Show when={useIsNarrow() != undefined && !useIsNarrow()}>
        <Show
          when={!props.isLoading()}
          fallback={
            <div class='relative rounded py-5 w-1/12 animate-pulse'>
              <VsCommentDiscussion class='text-slate-500 mx-auto' size={28} />
            </div>
          }
        >
          <div
            onClick={props.openCommentsPopup}
            class='relative rounded py-5 hover:bg-slate-600 cursor-pointer active:bg-slate-700 w-1/12'
          >
            <VsCommentDiscussion class='text-slate-400 mx-auto' size={28} />
            <div class='absolute top-1 right-4 text-sm text-slate-400 tracking-tighter'>
              {props.commentsCount()}
            </div>
          </div>
        </Show>
      </Show>
    </>
  );
};

export default CommentsActions;
