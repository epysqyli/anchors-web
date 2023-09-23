import { FiMail } from "solid-icons/fi";
import { parseDate } from "~/lib/nostr/nostr-utils";
import { CommentTree } from "~/lib/nostr/event-comments";
import { Component, For, JSX, Show, createSignal } from "solid-js";
import { VsArrowSmallDown, VsArrowSmallUp } from "solid-icons/vs";

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
      <div>
        <div class='text-sm text-left mb-1 w-fit rounded-md px-2 py-1 bg-slate-600'>
          <span class='font-bold'>
            {props.commentTree.event.data.name == "" ? "nostr user" : props.commentTree.event.data.name}
          </span>
          <span> replied on {parseDate(props.commentTree.event.data.created_at)}</span>
        </div>

        <p
          onClick={toggle}
          class={`${
            hasReplies()
              ? "cursor-pointer hover:border-neutral-700 hover:bg-neutral-600 active:bg-opacity-40"
              : ""
          } text-base text-neutral-200 break-words rounded-md text-left mx-auto bg-neutral-400
         bg-opacity-25 p-3 pb-3 border border-transparent transition`}
        >
          {props.commentTree.event.data.content}
        </p>

        <div class='flex justify-end items-center gap-x-3 px-2 py-1 mt-1 rounded-md w-fit ml-auto bg-slate-600'>
          <div class='flex items-center'>
            <span class='text-sm'>{props.commentTree.event.data.positive.count}</span>
            <VsArrowSmallUp size={25} />
          </div>
          <div class='flex items-center'>
            <span class='text-sm'>{props.commentTree.event.data.negative.count}</span>
            <VsArrowSmallDown size={26} />
          </div>
          <FiMail />
        </div>
      </div>

      <Show when={show()}>
        <div class='ml-14'>
          <For each={props.commentTree.event.comments}>
            {(cmtTree) => <CommentThread commentTree={cmtTree} />}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default CommentThread;
