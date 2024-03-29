import { Event } from "nostr-tools";
import Popup from "~/components/shared/Popup";
import { RelayContext } from "~/contexts/relay";
import { sortByCreatedAt } from "~/lib/nostr/nostr-utils";
import LoadingPoints from "~/components/feed/LoadingPoints";
import UserNostrEvent from "~/components/my-posts/UserNostrEvent";
import { For, Show, VoidComponent, createEffect, createSignal, onMount, useContext } from "solid-js";

const MyPosts: VoidComponent = () => {
  const { relay, anchorsMode } = useContext(RelayContext);

  const [events, setEvents] = createSignal<Event[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(true);
  const [showPopup, setShowPopup] = createSignal<boolean>(false);

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

  const fetchAndSetEvents = async (): Promise<void> => {
    if (relay.userPubKey == undefined) {
      console.log("your public key is not available");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const events = await relay.fetchTextEvents({
      rootOnly: true,
      isAnchorsMode: anchorsMode.get(),
      filter: { authors: [relay.userPubKey] }
    });

    setEvents(events.sort(sortByCreatedAt));
    setIsLoading(false);
  };

  onMount(async () => {
    await fetchAndSetEvents();
  });

  createEffect(async () => {
    anchorsMode.get();
    await fetchAndSetEvents();
  });

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold py-5 md:py-10'>
        Your {anchorsMode.get() ? "Anchors" : "Nostr"} posts
      </h1>

      <Show when={!isLoading()} fallback={<LoadingPoints />}>
        <div
          class='w-11/12 md:w-5/6 px-5 gap-1 mx-auto overflow-y-scroll md:custom-scrollbar
                 pb-10 h-4/5 grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-5 md:gap-y-10'
        >
          <For each={events()}>
            {(nostrEvent) => <UserNostrEvent nostrEvent={nostrEvent} handleDeletion={handleDeletion} />}
          </For>
        </div>
      </Show>

      <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 md:w-1/3'>
        <Popup autoClose={true} show={showPopup} setShow={setShowPopup}>
          <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full'>
            Post correctly deleted
          </div>
        </Popup>
      </div>
    </>
  );
};

export default MyPosts;
