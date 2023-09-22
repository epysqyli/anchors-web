import CommentThread from "./CommentThread";
import { Component, For, JSX, Show } from "solid-js";
import { CommentTree } from "~/lib/nostr/event-comments";

interface Props {
  commentsStructure: CommentTree | undefined;
}

const CommmentsPopup: Component<Props> = (props): JSX.Element => {
  return (
    <div class='h-[55vh] w-full mx-auto overflow-y-auto custom-scrollbar'>
      <h2 class='text-slate-100 text-center text-2xl md:text-4xl font-bold my-1'>Comments</h2>

      <div class='rounded h-[85%] px-5'>
        <Show when={props.commentsStructure != undefined}>
          <For each={props.commentsStructure!.event.comments}>
            {(cmtTree) => (
              <div class='my-7'>
                <CommentThread commentTree={cmtTree!} />
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};

export default CommmentsPopup;
