import { RelayContext } from "~/contexts/relay";
import { A, useSearchParams } from "solid-start";
import FollowingSelector from "./FollowingSelector";
import { FeedSearchParams } from "~/types/FeedSearchParams";
import { For, JSX, VoidComponent, useContext } from "solid-js";

const RelaySelector: VoidComponent = (): JSX.Element => {
  const { relay } = useContext(RelayContext);
  const [searchParams] = useSearchParams<FeedSearchParams>();

  const isCurrentRelay = (address: string): boolean => searchParams.relayAddress == address;
  const baseStyle = "my-1 py-1 px-3 block rounded mx-auto text-base text-center";
  const selectedStyle = "bg-neutral-800 bg-opacity-80 text-neutral-300";

  return (
    <>
      <div class=''>
        <div class='w-fit mx-auto text-center text-neutral-300 font-bold select-none'>
          Feed
        </div>
        <div class='flex justify-around my-5'>
          <FollowingSelector />
        </div>
      </div>

      <div class='h-5/6 overflow-y-scroll custom-scrollbar'>
        <A
          class={`${baseStyle} ${
            isCurrentRelay("all")
              ? selectedStyle
              : "text-neutral-500 hover:text-neutral-400 hover:bg-neutral-700"
          }`}
          href={`/?following=${searchParams.following}&relayAddress=all`}
        >
          All relays
        </A>

        <For each={relay.getReadRelays()}>
          {(address) => (
            <A
              class={`${baseStyle} ${
                isCurrentRelay(address)
                  ? selectedStyle
                  : "text-neutral-500 hover:text-neutral-400 hover:bg-neutral-700"
              }`}
              href={`/?following=${searchParams.following}&relayAddress=${encodeURIComponent(address)}`}
            >
              {address}
            </A>
          )}
        </For>
      </div>
    </>
  );
};

export default RelaySelector;
