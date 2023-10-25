import { RelayContext } from "~/contexts/relay";
import { A, useSearchParams } from "solid-start";
import { FeedSearchParams } from "~/types/FeedSearchParams";
import { For, JSX, VoidComponent, useContext } from "solid-js";

const RelaySelector: VoidComponent = (): JSX.Element => {
  const { readRelays } = useContext(RelayContext);
  const [searchParams] = useSearchParams<FeedSearchParams>();

  const isCurrentRelay = (address: string): boolean => searchParams.relayAddress == address;
  const baseStyle = "my-1 py-1 pl-1 block rounded mx-auto text-base";
  const selectedStyle = "bg-neutral-800 bg-opacity-80 text-neutral-300";

  return (
    <>
      <div class='h-5/6 overflow-y-scroll custom-scrollbar px-1'>
        <A
          class={`${baseStyle} ${
            isCurrentRelay("all")
              ? selectedStyle
              : "text-neutral-500 hover:text-neutral-400 hover:bg-slate-500 hover:bg-opacity-25"
          }`}
          href={`/?following=${searchParams.following}&relayAddress=all`}
        >
          All relays
        </A>

        <For each={readRelays()}>
          {(address) => (
            <A
              class={`${baseStyle} ${
                isCurrentRelay(address)
                  ? selectedStyle
                  : "text-neutral-500 hover:text-neutral-400 hover:bg-slate-500 hover:bg-opacity-25"
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
