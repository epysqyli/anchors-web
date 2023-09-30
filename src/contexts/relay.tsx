import "websocket-polyfill";
import type { Accessor, Context, Setter } from "solid-js";
import Relayer from "~/lib/nostr/relayer";
import { Component, JSX, createContext, createSignal } from "solid-js";
import { getPublicKeyFromExt } from "~/lib/nostr/nostr-utils";

interface IRelayContext {
  relay: Relayer;
  isAnchorsMode: Accessor<boolean>;
  setIsAnchorsMode: Setter<boolean>;
}

let relay: Relayer = new Relayer();
const pk = await getPublicKeyFromExt();

if (pk) {
  relay = new Relayer(pk);
  await relay.fetchAndSetRelays();

  const kindThreeEvent = await relay.fetchFollowingAndRelays();

  if (kindThreeEvent) {
    relay.following = kindThreeEvent.tags.map((e) => e[1]);
  }
}

const [isAnchorsMode, setIsAnchorsMode] = createSignal<boolean>(true);

const RelayContext: Context<IRelayContext> = createContext({
  relay: relay,
  isAnchorsMode: isAnchorsMode,
  setIsAnchorsMode: setIsAnchorsMode
});

const RelayProvider: Component<{ children: JSX.Element }> = (props) => {
  return (
    <RelayContext.Provider
      value={{ relay: relay, isAnchorsMode: isAnchorsMode, setIsAnchorsMode: setIsAnchorsMode }}
    >
      {props.children}
    </RelayContext.Provider>
  );
};

export { RelayProvider, RelayContext };
