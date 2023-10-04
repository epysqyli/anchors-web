import { RelayContext } from "~/contexts/relay";
import { A, useSearchParams } from "solid-start";
import { FeedSearchParams } from "~/types/FeedSearchParams";
import { For, JSX, VoidComponent, useContext } from "solid-js";

const RelaySelector: VoidComponent = (): JSX.Element => {
  const { relay } = useContext(RelayContext);
  const [searchParams] = useSearchParams<FeedSearchParams>();

  const isCurrentRelay = (address: string): boolean => searchParams.relayAddress == address;

  return (
    <>
      <A
        class={`${
          isCurrentRelay("all") ? "bg-neutral-800 bg-opacity-80" : ""
        } my-1 py-1 px-3 block rounded mx-auto`}
        href={`/?following=${searchParams.following}&relayAddress=all`}
      >
        all relays
      </A>

      <For each={relay.getReadRelays()}>
        {(address) => (
          <A
            class={`${
              isCurrentRelay(address) ? "bg-neutral-800 bg-opacity-80" : ""
            } my-1 py-1 px-3 block rounded mx-auto`}
            href={`/?following=${searchParams.following}&relayAddress=${encodeURIComponent(address)}`}
          >
            {address}
          </A>
        )}
      </For>
    </>
  );
};

export default RelaySelector;
