import { RelayContext } from "~/contexts/relay";
import { Event as NostrEvent } from "nostr-tools";
import { sortByCreatedAt } from "~/lib/nostr/nostr-utils";
import { Component, JSX, onMount, useContext } from "solid-js";

interface Props {
  rootEvent: NostrEvent;
}

const CommmentsPopup: Component<Props> = (props): JSX.Element => {
  const { relay } = useContext(RelayContext);

  /**
   * define Relayer methods to build the comments thread starting from the root event
   * handle both positional (deprecated) and marked 'e' tags at the same time
   * build all subthread based on subroots
   * once the data structure is ready, display the UI correctly
   * UI should allow all normal comment operations and update accordingly
   * show a total comments number before opening the comments popup
   */
  onMount(async () => {
    const comments = await relay.fetchTextEvents({ "#e": [props.rootEvent.id] });
    console.log(comments.sort(sortByCreatedAt));
  });

  return (
    <div class='h-[55vh] w-full mx-auto overflow-y-auto custom-scrollbar'>
      <h2 class='text-slate-100 text-center text-2xl md:text-4xl font-bold'>Comments</h2>
    </div>
  );
};

export default CommmentsPopup;
