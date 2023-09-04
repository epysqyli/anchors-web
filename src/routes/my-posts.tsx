import { Event } from "nostr-tools";
import Popup from "~/components/shared/Popup";
import { RelayContext } from "~/contexts/relay";
import { useBeforeLeave } from "@solidjs/router";
import { sortByCreatedAt } from "~/lib/nostr/nostr-utils";
import LoadingFallback from "~/components/feed/LoadingFallback";
import UserNostrEvent from "~/components/my-posts/UserNostrEvent";
import { For, Show, VoidComponent, createSignal, onMount, useContext } from "solid-js";

const MyPosts: VoidComponent = () => {
  const { relay } = useContext(RelayContext);

  const [events, setEvents] = createSignal<Event[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(true);
  const [showPopup, setShowPopup] = createSignal<boolean>(false);
  const [intervalID, setIntervalID] = createSignal<NodeJS.Timer>();

  const handleDeletion = async (nostrEventID: string): Promise<void> => {
    const pubResult = await relay.deleteEvent(nostrEventID);

    if (pubResult.error) {
      console.log("Delete event failed");
      return;
    }

    const remainingEvents: Event[] = events().filter((evt) => evt.id != nostrEventID);
    setEvents(remainingEvents);
    setShowPopup(true);
  };

  onMount(async () => {
    // keep alive - any better way?
    const intervalID = setInterval(async () => await relay.fetchAndUnsubKindThreeEvent(), 30000);
    setIntervalID(intervalID);

    if (window.nostr == undefined) {
      console.log("browser nostr extension needed");
      return;
    }

    if (relay.userPubKey == undefined) {
      console.log("your public key is not available");
      setIsLoading(false);
      return;
    }

    const events = await relay.fetchTextEvents({ authors: [relay.userPubKey] });
    setEvents(events.sort(sortByCreatedAt));
    setIsLoading(false);
  });

  useBeforeLeave(() => {
    clearInterval(intervalID());
  });

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold mt-14 mb-10'>Your nostr posts</h1>
      <Show when={!isLoading()} fallback={<LoadingFallback />}>
        <div class='w-4/5 xl:w-2/3 2xl:w-3/5 px-5 mx-auto overflow-y-scroll custom-scrollbar h-4/5'>
          <For each={events()}>
            {(nostrEvent) => <UserNostrEvent nostrEvent={nostrEvent} handleDeletion={handleDeletion} />}
          </For>
        </div>
      </Show>

      <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 xl:w-1/3'>
        <Popup autoClose={true} show={showPopup} setShow={setShowPopup}>
          <div>you deleted the event</div>
        </Popup>
      </div>
    </>
  );
};

export default MyPosts;
