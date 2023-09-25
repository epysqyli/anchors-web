import WriteComment from "./WriteComment";
import CommentThread from "./CommentThread";
import { CommentTree } from "~/lib/nostr/event-comments";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { Component, For, JSX, createSignal } from "solid-js";

interface Props {
  commentsStructure: CommentTree | undefined;
}

const CommmentsPopup: Component<Props> = (props): JSX.Element => {
  const [replyEvent, setReplyEvent] = createSignal<IEnrichedEvent>();

  return (
    <div class='h-[55vh] w-full mx-auto'>
      <div class='rounded h-[95%]'>
        <div class='h-5/6 overflow-y-scroll custom-scrollbar pr-2'>
          <For each={props.commentsStructure!.event.comments}>
            {(cmtTree) => (
              <div class='my-7'>
                <CommentThread commentTree={cmtTree!} replyEvent={replyEvent} setReplyEvent={setReplyEvent} />
              </div>
            )}
          </For>
        </div>

        <div class='h-1/6 mt-2'>
          <WriteComment replyEvent={replyEvent} setReplyEvent={setReplyEvent} />
        </div>
      </div>
    </div>
  );
};

export default CommmentsPopup;
