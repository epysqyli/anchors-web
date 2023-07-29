import { useIsRouting } from "solid-start";
import Popup from "~/components/shared/Popup";
import { RelayContext } from "~/contexts/relay";
import LoadingFallback from "~/components/feed/LoadingFallback";
import UserNostrEvent from "~/components/my-posts/UserNostrEvent";
import { deleteNostrEvent } from "~/lib/nostr/nostr-nips-actions";
import { Event, Kind, Sub, validateEvent, verifySignature } from "nostr-tools";
import { checkAndSetPublicKey, sortByCreatedAt } from "~/lib/nostr/nostr-utils";
import { For, Show, VoidComponent, createSignal, onMount, useContext } from "solid-js";

const MyPosts: VoidComponent = () => {
  const relay = useContext(RelayContext);

  const [isLoading, setIsLoading] = createSignal<boolean>(true);
  const [publicKey, setPublicKey] = createSignal<string>("");
  const [events, setEvents] = createSignal<Event[]>([]);
  const [showPopup, setShowPopup] = createSignal<boolean>(false);

  const handleDeletion = async (nostrEventID: string): Promise<void> => {
    await deleteNostrEvent(relay, nostrEventID);
    const remainingEvents: Event[] = events().filter((evt) => evt.id != nostrEventID);
    setEvents(remainingEvents);
    setShowPopup(true);
  };

  onMount(async () => {
    if (window.nostr == undefined) {
      console.log("browser nostr extension needed");
      return;
    }

    if (!useIsRouting()()) {
      await checkAndSetPublicKey(setPublicKey);
    }

    const eventsSub: Sub = relay.sub([{ authors: [publicKey()] }]);

    eventsSub.on("event", (nostrEvent: Event) => {
      if (nostrEvent.kind === Kind.Text && validateEvent(nostrEvent) && verifySignature(nostrEvent)) {
        setEvents([...events(), nostrEvent].sort(sortByCreatedAt));
      }
    });

    eventsSub.on("eose", () => {
      setIsLoading(false);
    });
  });

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold my-14'>Your nostr posts</h1>
      <Show when={!isLoading()} fallback={<LoadingFallback />}>
        <div class='grid grid-cols-2 xl:grid-cols-3 p-1 gap-x-3 gap-y-5 h-4/5 w-4/5 mx-auto rounded-md overflow-y-scroll custom-scrollbar'>
          <For each={events()}>
            {(nostrEvent) => (
              <div class='col-span-1'>
                <UserNostrEvent nostrEvent={nostrEvent} handleDeletion={handleDeletion} />
              </div>
            )}
          </For>
        </div>
      </Show>

      <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 xl:w-1/3'>
        <Popup show={showPopup} setShow={setShowPopup}>
          <div>you deleted the event</div>
        </Popup>
      </div>
    </>
  );
};

export default MyPosts;
