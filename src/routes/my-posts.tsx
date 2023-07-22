import { RelayContext } from "~/contexts/relay";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { sortByCreatedAt } from "~/lib/nostr/nostr-utils";
import { Event, Kind, Sub, validateEvent, verifySignature } from "nostr-tools";
import { Show, VoidComponent, createSignal, onMount, useContext } from "solid-js";
import LoadingFallback from "~/components/feed/LoadingFallback";

const MyPosts: VoidComponent = () => {
  const relay = useContext(RelayContext);
  const [isLoading, setIsLoading] = createSignal<boolean>(true);
  const [events, setEvents] = createSignal<IEnrichedEvent[]>([]);

  onMount(async () => {
    const eventsSub: Sub = relay.sub([
      { authors: ["8becb32986f141b2399559e34fd31a720376f4bbbeb735ed8a3288d544cf946f"] }
    ]);

    eventsSub.on("event", (nostrEvent: Event) => {
      if (nostrEvent.kind === Kind.Text && validateEvent(nostrEvent) && verifySignature(nostrEvent)) {
        setEvents([...events(), { ...nostrEvent, name: "", picture: "", about: "" }].sort(sortByCreatedAt));
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
        <div class='text-center text-slate-50'>{events()[0].content}</div>
      </Show>
    </>
  );
};

export default MyPosts;
