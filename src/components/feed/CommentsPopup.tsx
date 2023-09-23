import CommentThread from "./CommentThread";
import { Component, For, JSX, Show } from "solid-js";
import { CommentTree } from "~/lib/nostr/event-comments";

interface Props {
  commentsStructure: CommentTree | undefined;
}

const CommmentsPopup: Component<Props> = (props): JSX.Element => {
  return (
    <div class='h-[55vh] w-full mx-auto overflow-y-auto custom-scrollbar'>
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
