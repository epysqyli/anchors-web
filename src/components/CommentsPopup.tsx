import { RelayContext } from "~/contexts/relay";
import { Event as NostrEvent } from "nostr-tools";
import EventComments from "~/lib/nostr/event-comments";
import { Component, JSX, onMount, useContext } from "solid-js";

interface Props {
  rootEvent: NostrEvent;
}

const CommmentsPopup: Component<Props> = (props): JSX.Element => {
  const { relay } = useContext(RelayContext);

  /**
   * display the UI correctly based on the CommentsTree structure
   * UI should allow all normal comment operations and update accordingly
   * show a total comments number before opening the comments popup
   */
  onMount(async () => {
    const comments = await relay.fetchComments(props.rootEvent.id);
    const eventComments = new EventComments(props.rootEvent, comments);
  });

  return (
    <div class='h-[55vh] w-full mx-auto overflow-y-auto custom-scrollbar'>
      <h2 class='text-slate-100 text-center text-2xl md:text-4xl font-bold'>Comments</h2>
    </div>
  );
};

export default CommmentsPopup;
