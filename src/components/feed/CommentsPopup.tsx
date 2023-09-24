import WriteComment from "./WriteComment";
import CommentThread from "./CommentThread";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { CommentTree } from "~/lib/nostr/event-comments";
import { Component, For, JSX, createContext } from "solid-js";

interface Props {
  commentsStructure: CommentTree | undefined;
}

const CommmentsPopup: Component<Props> = (props): JSX.Element => {
  return (
    <div class='h-[55vh] w-full mx-auto overflow-y-auto custom-scrollbar'>
      <div class='rounded h-[85%] px-5'>
        <div class='mb-16'>
          <WriteComment replyEvent={props.commentsStructure?.event.data!} />
        </div>

        <For each={props.commentsStructure!.event.comments}>
          {(cmtTree) => (
            <div class='my-7'>
              <CommentThread commentTree={cmtTree!} />
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default CommmentsPopup;
