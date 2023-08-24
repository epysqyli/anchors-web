import "websocket-polyfill";
import { Relay, relayInit } from "nostr-tools";
import type { Accessor, Context, Setter } from "solid-js";
import { fetchUserFollowing } from "~/lib/nostr/nostr-nips-actions";
import { Component, JSX, createContext, createSignal, onMount } from "solid-js";

interface IRelayContext {
  relay: Relay;
  publicKey: string;
  following: Accessor<string[]>;
  setFollowing: Setter<string[]>;
}

let pk = "";

try {
  pk = await window.nostr.getPublicKey();
} catch (error) {
  try {
    await new Promise((_) => setTimeout(_, 500));
    pk = await window.nostr.getPublicKey();
  } catch (error) {}
}

const relay = relayInit("ws://localhost:2700");
// const relay = relayInit("wss://nostr.wine");
(async () => await relay.connect())();

// embed into a createRoot reactive scope to ensure memory disposal?
const [following, setFollowing] = createSignal<string[]>([]);

const RelayContext: Context<IRelayContext> = createContext<IRelayContext>({
  relay: relay,
  publicKey: pk,
  following: following,
  setFollowing: setFollowing
});

const RelayProvider: Component<{ children: JSX.Element }> = (props) => {
  onMount(async () => await fetchUserFollowing(relay, pk, setFollowing));

  return (
    <RelayContext.Provider
      value={{ relay: relay, publicKey: pk, following: following, setFollowing: setFollowing }}
    >
      {props.children}
    </RelayContext.Provider>
  );
};

export { RelayProvider, RelayContext };
