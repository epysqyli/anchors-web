import WriteComment from "./WriteComment";
import { VsLoading } from "solid-icons/vs";
import CommentThread from "./CommentThread";
import { CommentsContext } from "./EventWrapper";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { CommentTree } from "~/lib/nostr/event-comments";
import { Component, For, JSX, Show, createSignal, useContext } from "solid-js";

interface Props {
  commentsStructure: CommentTree | undefined;
}

const CommmentsPopup: Component<Props> = (props): JSX.Element => {
  const commentsContext = useContext(CommentsContext)!;
  const [replyEvent, setReplyEvent] = createSignal<IEnrichedEvent>();

  return (
    <div class='h-full w-full mx-auto'>
      <div class='rounded h-[95%] flex flex-col justify-between'>
        <div class='h-4/5 overflow-y-scroll custom-scrollbar pr-2'>
          <Show
            when={!commentsContext.isCommentTreeLoading()}
            fallback={<VsLoading size={100} color='white' class='animate-spin mx-auto w-fit py-3 mt-20' />}
          >
            <For each={props.commentsStructure!.event.comments}>
              {(cmtTree) => (
                <div class='my-7'>
                  <CommentThread
                    commentTree={cmtTree!}
                    replyEvent={replyEvent}
                    setReplyEvent={setReplyEvent}
                  />
                </div>
              )}
            </For>
          </Show>
        </div>

        <div class='h-1/5'>
          <WriteComment replyEvent={replyEvent} setReplyEvent={setReplyEvent} />
        </div>
      </div>
    </div>
  );
};

export default CommmentsPopup;
