import { RelayContext } from "~/contexts/relay";
import { A, useSearchParams } from "solid-start";
import { FiArrowRightCircle } from "solid-icons/fi";
import { FeedSearchParams } from "~/types/FeedSearchParams";
import { For, JSX, VoidComponent, createSignal, useContext } from "solid-js";

const RelaySelector: VoidComponent = (): JSX.Element => {
  const { readRelays } = useContext(RelayContext);
  const [searchParams] = useSearchParams<FeedSearchParams>();

  const isCurrentRelay = (address: string): boolean => searchParams.relayAddress == address;
  const baseStyle = "my-1 py-1 pl-1 block rounded mx-auto text-base";
  const selectedStyle = "bg-neutral-800 bg-opacity-80 text-neutral-300";

  const [inputFieldRelayAddress, setInputFieldRelayAddress] = createSignal<string>("");

  const handleChange = (e: Event): void => {
    setInputFieldRelayAddress((e.currentTarget as HTMLInputElement).value);
  };

  return (
    <>
      <div class='h-5/6 bg-slate-700 bg-opacity-25 rounded p-1 xl:p-0 xl:bg-transparent'>
        <div class='overflow-y-scroll overflow-x-hidden xl:custom-scrollbar px-1 h-4/5'>
          <A
            class={`${baseStyle} ${
              isCurrentRelay("all")
                ? selectedStyle + " text-right pr-3"
                : "text-neutral-500 hover:text-neutral-400 hover:bg-slate-500 hover:bg-opacity-25 text-right pr-3"
            }`}
            href={`/?following=${searchParams.following}&relayAddress=all`}
          >
            All relays
          </A>

          <For each={readRelays.get()}>
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

        <div class='flex items-center justify-between text-sm mt-5'>
          <input
            onchange={handleChange}
            type='text'
            placeholder='Enter a relay address'
            class='block w-4/5 rounded focus:outline-none px-3 py-2 bg-neutral-800 text-neutral-200 caret-neutral-400'
          />

          <A
            href={`/?following=${searchParams.following}&relayAddress=${encodeURIComponent(
              inputFieldRelayAddress() == "" ? "all" : inputFieldRelayAddress()
            )}`}
            class='w-1/5 group'
          >
            <FiArrowRightCircle
              class='mx-auto text-neutral-400 hover:text-neutral-200 group-active:scale-95'
              size={28}
            />
          </A>
        </div>
      </div>
    </>
  );
};

export default RelaySelector;
