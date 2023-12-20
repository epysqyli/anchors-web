import { RelayContext } from "~/contexts/relay";
import { A, useSearchParams } from "solid-start";
import { FiArrowRightCircle } from "solid-icons/fi";
import { FeedSearchParams } from "~/types/FeedSearchParams";
import { For, JSX, Show, VoidComponent, createEffect, createSignal, onMount, useContext } from "solid-js";

const RelaySelector: VoidComponent = (): JSX.Element => {
  const { readRelays, setupDone } = useContext(RelayContext);
  const [searchParams] = useSearchParams<FeedSearchParams>();

  const isCurrentRelay = (address: string): boolean => searchParams.relayAddress == address;
  const baseStyle = "my-1 py-1 block rounded mx-auto text-base md:text-sm text-center";
  const selectedStyle = "bg-slate-500 md:bg-neutral-800 bg-opacity-80 text-neutral-300";
  const nonSelectedStyle = "text-neutral-500 hover:text-neutral-400 hover:bg-slate-500 hover:bg-opacity-25";

  const [inputFieldRelayAddress, setInputFieldRelayAddress] = createSignal<string>("");
  const [isLoading, setIsLoading] = createSignal<boolean>(true);

  const handleChange = (e: Event): void => {
    setInputFieldRelayAddress((e.currentTarget as HTMLInputElement).value);
  };

  onMount(() => {
    setupDone();
    setIsLoading(false);
  });

  createEffect(() => {
    const relayAddressFromQueryParams = searchParams.relayAddress;

    if (
      relayAddressFromQueryParams != "all" &&
      relayAddressFromQueryParams != undefined &&
      relayAddressFromQueryParams != "undefined" &&
      !readRelays.get().includes(relayAddressFromQueryParams)
    ) {
      readRelays.set([...readRelays.get(), relayAddressFromQueryParams]);
    }
  });

  return (
    <>
      <Show
        when={!isLoading()}
        fallback={
          <div class='h-[30dvh] md:h-full bg-slate-800 bg-opacity-25 rounded py-2 md:bg-neutral-700 md:bg-opacity-25'>
            <div class='bg-slate-700 md:bg-neutral-800 h-1/6 my-1 w-11/12 md:w-4/5 animate-pulse rounded-md mx-auto'></div>
            <div class='bg-slate-700 md:bg-neutral-800 h-1/6 my-1 w-11/12 md:w-4/5 animate-pulse rounded-md mx-auto'></div>
            <div class='bg-slate-700 md:bg-neutral-800 h-1/6 my-1 w-11/12 md:w-4/5 animate-pulse rounded-md mx-auto'></div>
            <div class='bg-slate-700 md:bg-neutral-800 h-1/6 my-1 w-11/12 md:w-4/5 animate-pulse rounded-md mx-auto'></div>
            <div class='bg-slate-700 md:bg-neutral-800 h-1/6 my-1 w-11/12 md:w-4/5 animate-pulse rounded-md mx-auto'></div>
          </div>
        }
      >
        <div class='h-5/6 md:h-full bg-slate-700 bg-opacity-25 rounded p-1 md:p-0 md:bg-neutral-700 md:bg-opacity-25 flex flex-col justify-between'>
          <div class='overflow-y-scroll overflow-x-hidden md:custom-scrollbar px-1 max-h-4/5'>
            <A
              class={`${baseStyle} ${isCurrentRelay("all") ? selectedStyle : nonSelectedStyle}`}
              href={`/?following=${searchParams.following}&relayAddress=all`}
            >
              All relays
            </A>

            <For each={readRelays.get()}>
              {(address) => (
                <A
                  class={`${baseStyle} ${isCurrentRelay(address) ? selectedStyle : nonSelectedStyle}`}
                  href={`/?following=${searchParams.following}&relayAddress=${encodeURIComponent(address)}`}
                >
                  {address}
                </A>
              )}
            </For>
          </div>

          <div class='flex items-center justify-between text-sm md:px-1 h-1/5 mt-5'>
            <input
              onchange={handleChange}
              type='text'
              placeholder='Enter a relay address'
              class='block w-4/5 rounded focus:outline-none px-3 py-2 bg-slate-600 md:bg-neutral-800 text-neutral-200 caret-neutral-400'
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
      </Show>
    </>
  );
};

export default RelaySelector;
