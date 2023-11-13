import { RelayContext } from "~/contexts/relay";
import LoadingPoints from "~/components/feed/LoadingPoints";
import EventWithMetadata from "~/interfaces/EventWithMetadata";
import FavoritePost from "~/components/favorite-posts/FavoritePost";
import { For, JSX, Show, VoidComponent, createSignal, onMount, useContext } from "solid-js";

const FavoritePosts: VoidComponent = (): JSX.Element => {
  const { relay } = useContext(RelayContext);

  const [events, setEvents] = createSignal<EventWithMetadata[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(true);

  onMount(async () => {
    setIsLoading(true);
    setEvents(await relay.fetchFavoriteEvents());
    setIsLoading(false);
  });

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold py-5 xl:py-10'>
        Your favorite posts
      </h1>

      <Show when={!isLoading()} fallback={<LoadingPoints />}>
        <div
          class='w-11/12 xl:w-5/6 px-5 gap-1 mx-auto overflow-y-scroll xl:custom-scrollbar
                 pb-10 h-4/5 grid grid-cols-1 xl:grid-cols-3 gap-x-5 gap-y-5 xl:gap-y-10'
        >
          <For each={events()}>{(event) => <FavoritePost event={event} />}</For>
        </div>
      </Show>
    </>
  );
};

export default FavoritePosts;
