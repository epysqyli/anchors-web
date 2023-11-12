import { FiBookmark } from "solid-icons/fi";
import { RelayContext } from "~/contexts/relay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import { JSX, Show, Component, useContext, createSignal, onMount } from "solid-js";

const FavoriteEvent: Component<{ eventID: string }> = (props): JSX.Element => {
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
      }
    } else {
      const pubRes = await relay.addEventToFavorites(props.eventID);
      if (!pubRes.error) {
        setIsEventFav(true);
      }
    }

    setIsLoading(false);
  };

  return (
    <>
      <Show when={useIsNarrow() != undefined && useIsNarrow()}>
        <div onClick={handleClick}>
          <FiBookmark
            class={`${isLoading() ? "animate-pulse" : ""} text-slate-400 mx-auto`}
            stroke-width={1.5}
            size={24}
            fill={`${isEventFav() ? "#e2e8f0" : "#334155"}`}
          />
        </div>
      </Show>

      <Show when={useIsNarrow() != undefined && !useIsNarrow()}>
        <div onClick={handleClick} class='group cursor-pointer transition'>
          <FiBookmark
            class={`${isLoading() ? "animate-pulse" : ""} text-slate-400 mx-auto group-hover:scale-105`}
            stroke-width={1}
            size={34}
            fill={`${isEventFav() ? "#e2e8f0" : "#334155"}`}
          />
        </div>
      </Show>
    </>
  );
};

export default FavoriteEvent;
