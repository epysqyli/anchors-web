import { CommentTree } from "~/lib/nostr/event-comments";
import { Component, For, JSX, Show, createSignal } from "solid-js";

interface Props {
  commentTree: CommentTree;
}

const CommentThread: Component<Props> = (props): JSX.Element => {
  const [show, setShow] = createSignal<boolean>(false);
  const toggle = (): void => {
    if (hasReplies()) {
      setShow(!show());
    }
  };

  const hasReplies = (): boolean => props.commentTree.event.comments.length != 0;

  return (
    <div class='my-3'>
      <p
        onClick={toggle}
        class={`${
          hasReplies() ? "cursor-pointer hover:border-neutral-700 active:bg-neutral-600" : ""
        } text-base text-neutral-200 break-words rounded-md text-left mx-auto bg-neutral-400
         bg-opacity-25 p-3 pb-3 border border-transparent`}
      >
        {props.commentTree.event.data.content}
      </p>

      <Show when={show()}>
        <div class='ml-5'>
          <For each={props.commentTree.event.comments}>
            {(cmtTree) => <CommentThread commentTree={cmtTree} />}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default CommentThread;
