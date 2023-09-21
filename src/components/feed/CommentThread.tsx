import { Component, For, JSX } from "solid-js";
import { CommentTree } from "~/lib/nostr/event-comments";

interface Props {
  commentTree: CommentTree;
}

const CommentThread: Component<Props> = (props): JSX.Element => {
  return (
    <div class='my-7'>
      <p class='text-base break-words text-left mx-auto bg-neutral-600 bg-opacity-25 p-3 pb-3'>
        {props.commentTree.event.data.content}
      </p>

      <div class='ml-5'>
        <For each={props.commentTree.event.comments}>
          {(cmtTree) => <CommentThread commentTree={cmtTree} />}
        </For>
      </div>
    </div>
  );
};

export default CommentThread;
