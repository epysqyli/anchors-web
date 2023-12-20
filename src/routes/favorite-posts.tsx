import { RelayContext } from "~/contexts/relay";
import LoadingPoints from "~/components/feed/LoadingPoints";
import EventWithMetadata from "~/interfaces/EventWithMetadata";
import FavoritePost from "~/components/favorite-posts/FavoritePost";
import { For, JSX, Show, VoidComponent, createEffect, createSignal, onMount, useContext } from "solid-js";

const FavoritePosts: VoidComponent = (): JSX.Element => {
  const { relay, anchorsMode } = useContext(RelayContext);

  const [events, setEvents] = createSignal<EventWithMetadata[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(true);

  onMount(async () => {
    setIsLoading(true);
    setEvents(await relay.fetchFavoriteEvents(anchorsMode.get()));
    setIsLoading(false);
  });

  createEffect(async () => {
    anchorsMode.get();
    setIsLoading(true);
    setEvents(await relay.fetchFavoriteEvents(anchorsMode.get()));
    setIsLoading(false);
  });

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold py-5 md:py-10'>
        Your favorite { anchorsMode.get() ? 'Anchors' : 'Nostr' } posts
      </h1>

      <Show when={!isLoading()} fallback={<LoadingPoints />}>
        <div
          class='w-11/12 md:w-5/6 px-5 gap-1 mx-auto overflow-y-scroll md:custom-scrollbar
                 pb-10 h-4/5 grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-5 md:gap-y-10'
        >
          <For each={events()}>{(event) => <FavoritePost event={event} />}</For>
        </div>
      </Show>
    </>
  );
};

export default FavoritePosts;
