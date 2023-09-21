import { RelayContext } from "~/contexts/relay";
import { Event as NostrEvent } from "nostr-tools";
import LoadingFallback from "./LoadingFallback";
import EventComments, { CommentTree } from "~/lib/nostr/event-comments";
import { Component, For, JSX, Show, createSignal, onMount, useContext } from "solid-js";
import CommentThread from "./CommentThread";

interface Props {
  rootEvent: NostrEvent;
}

const CommmentsPopup: Component<Props> = (props): JSX.Element => {
  const { relay } = useContext(RelayContext);

  const [isLoading, setIsLoading] = createSignal<boolean>(true);
  const [commentsStructure, setCommentsStructure] = createSignal<CommentTree>();

  onMount(async () => {
    const comments = await relay.fetchComments(props.rootEvent.id);
    if (comments.length != 0) {
      setCommentsStructure(new EventComments(props.rootEvent, comments).structure);
    }

    setIsLoading(false);
  });

  return (
    <div class='h-[55vh] w-full mx-auto overflow-y-auto custom-scrollbar'>
      <h2 class='text-slate-100 text-center text-2xl md:text-4xl font-bold my-1'>Comments</h2>
      <Show when={!isLoading()} fallback={<LoadingFallback />}>
        <div class='rounded h-[85%] px-5'>
          <For each={commentsStructure()?.event.comments}>
            {(cmtTree) => <CommentThread commentTree={cmtTree!} />}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default CommmentsPopup;
