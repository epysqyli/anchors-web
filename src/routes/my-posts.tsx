import { useIsRouting } from "solid-start";
import { RelayContext } from "~/contexts/relay";
import { sortByCreatedAt } from "~/lib/nostr/nostr-utils";
import LoadingFallback from "~/components/feed/LoadingFallback";
import UserNostrEvent from "~/components/my-posts/UserNostrEvent";
import { Event, Kind, Sub, validateEvent, verifySignature } from "nostr-tools";
import { For, Show, VoidComponent, createSignal, onMount, useContext } from "solid-js";
import ActionPopup from "~/components/shared/ActionPopup";
import OverlayContext from "~/contexts/overlay";

const MyPosts: VoidComponent = () => {
  const relay = useContext(RelayContext);
  const overlayContext = useContext(OverlayContext);

  const [isLoading, setIsLoading] = createSignal<boolean>(true);
  const [events, setEvents] = createSignal<Event[]>([]);
  const [showActionPopup, setShowActionPopup] = createSignal<boolean>(false);
  const [isActionSuccessful, setIsActionSuccessful] = createSignal<boolean>(false);

  const togglePopup = (): void => {
    setShowActionPopup(!showActionPopup());
    overlayContext.toggleOverlay();
  };

  onMount(async () => {
    if (window.nostr == undefined) {
      setIsActionSuccessful(false);
      setShowActionPopup(true);
      overlayContext.toggleOverlay();
      return;
    }

    let pk = "";

    if (!useIsRouting()()) {
      try {
        pk = await window.nostr.getPublicKey();
      } catch (error) {
        await new Promise((_) => setTimeout(_, 500));
        pk = await window.nostr.getPublicKey();
      }
    }

    const eventsSub: Sub = relay.sub([{ authors: [pk] }]);

    eventsSub.on("event", (nostrEvent: Event) => {
      if (nostrEvent.kind === Kind.Text && validateEvent(nostrEvent) && verifySignature(nostrEvent)) {
        setEvents([...events(), nostrEvent].sort(sortByCreatedAt));
      }
    });

    // enrich events with metadata

    eventsSub.on("eose", () => {
      setIsLoading(false);
    });
  });

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold my-14'>Your nostr posts</h1>
      <Show when={!isLoading()} fallback={<LoadingFallback />}>
        <div class='grid grid-cols-2 xl:grid-cols-3 p-1 gap-x-3 gap-y-3 h-4/5 w-4/5 mx-auto rounded-md overflow-y-scroll custom-scrollbar'>
          <For each={events()}>
            {(nostrEvent) => (
              <div class='col-span-1'>
                <UserNostrEvent nostrEvent={nostrEvent} />
              </div>
            )}
          </For>
        </div>
      </Show>

      <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 xl:w-1/3'>
        <ActionPopup
          message={() => "A browser nostr extension is needed to sign events, but is currently not available"}
          show={showActionPopup}
          togglePopup={togglePopup}
          isActionSuccessful={isActionSuccessful}
        />
      </div>
    </>
  );
};

export default MyPosts;
