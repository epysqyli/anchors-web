import "websocket-polyfill";
import { Relay, relayInit } from "nostr-tools";
import { IFollowing } from "~/interfaces/IFollowing";
import type { Accessor, Context, Setter } from "solid-js";
import { fetchUserFollowing } from "~/lib/nostr/nostr-nips-actions";
import { Component, JSX, createContext, createSignal, onMount } from "solid-js";

interface IRelayContext {
  relay: Relay;
  publicKey: string;
  following: Accessor<IFollowing[]>;
  setFollowing: Setter<IFollowing[]>;
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
const [following, setFollowing] = createSignal<IFollowing[]>([]);

const RelayContext: Context<IRelayContext> = createContext<IRelayContext>({
  relay: relay,
  publicKey: pk,
  following: following,
  setFollowing: setFollowing
});

const RelayProvider: Component<{ children: JSX.Element }> = (props) => {
  onMount(() => {
    fetchUserFollowing(relay, pk, following, setFollowing);
  });

  return (
    <RelayContext.Provider
      value={{ relay: relay, publicKey: pk, following: following, setFollowing: setFollowing }}
    >
      {props.children}
    </RelayContext.Provider>
  );
};

export { RelayProvider, RelayContext };
