import { RelayContext } from "~/contexts/relay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import { BsBookmarks, BsBookmarksFill } from "solid-icons/bs";
import { JSX, Show, Component, useContext, createSignal, onMount } from "solid-js";

const FavoriteEventAction: Component<{ eventID: string }> = (props): JSX.Element => {
  const { relay, favoriteEventIDs } = useContext(RelayContext);

  const [isEventFav, setIsEventFav] = createSignal<boolean>(false);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  onMount(() => {
    setIsEventFav(favoriteEventIDs.get().includes(props.eventID));
  });

  const handleClick = async (): Promise<void> => {
    if (isLoading()) {
      return;
    }

    setIsLoading(true);

    if (isEventFav()) {
      const pubRes = await relay.removeEventFromFavorites(props.eventID);
      if (!pubRes.error) {
        setIsEventFav(false);
        favoriteEventIDs.set(pubRes.data);
      }
    } else {
      const pubRes = await relay.addEventToFavorites(props.eventID);
      if (!pubRes.error) {
        setIsEventFav(true);
        favoriteEventIDs.set(pubRes.data);
      }
    }

    setIsLoading(false);
  };

  return (
    <>
      <Show when={useIsNarrow() != undefined && useIsNarrow()}>
        <div onClick={handleClick}>
          {isEventFav() ? (
            <BsBookmarksFill
              class={`${isLoading() ? "animate-pulse" : ""} text-slate-400 mx-auto`}
              stroke-width={1}
              size={28}
            />
          ) : (
            <BsBookmarks
              class={`${isLoading() ? "animate-pulse" : ""} text-slate-400 mx-auto`}
              stroke-width={1}
              size={28}
            />
          )}
        </div>
      </Show>

      <Show when={useIsNarrow() != undefined && !useIsNarrow()}>
        <div onClick={handleClick} class='group cursor-pointer transition'>
          {isEventFav() ? (
            <BsBookmarksFill
              class={`${
                isLoading() ? "animate-pulse cursor-wait" : ""
              } text-slate-400 mx-auto group-hover:scale-105`}
              stroke-width={1}
              size={28}
            />
          ) : (
            <BsBookmarks
              class={`${
                isLoading() ? "animate-pulse cursor-wait" : ""
              } text-slate-400 mx-auto group-hover:scale-105`}
              stroke-width={1}
              size={28}
            />
          )}
        </div>
      </Show>
    </>
  );
};

export default FavoriteEventAction;
