import "websocket-polyfill";
import { Relay, SimplePool, relayInit } from "nostr-tools";
import type { Accessor, Context, Setter } from "solid-js";
import { getPublicKeyFromExt } from "~/lib/nostr/nostr-utils";
import { Component, JSX, createContext, createSignal, onMount } from "solid-js";
import { fetchUserFollowing, fetchUserRelayUrls } from "~/lib/nostr/nostr-relay-calls";

interface IRelayContext {
  relay: Relay;
  publicKey: string;
  following: Accessor<string[]>;
  setFollowing: Setter<string[]>;
  defaultRelay: string;
  relaysUrls: Accessor<string[]>;
  relayPool: SimplePool;
}

const defaultRelay = "ws://localhost:2700";
const pk = await getPublicKeyFromExt();

const relay = relayInit(defaultRelay);
(async () => await relay.connect())();

// setup relay pool and change method call throughout the codebase
const [relayUrls, setRelayUrls] = createSignal<string[]>([defaultRelay]);

if (pk) {
  await fetchUserRelayUrls(relay, pk, setRelayUrls);
}

const relayPool: SimplePool = new SimplePool();

// embed into a createRoot reactive scope to ensure memory disposal?
const [following, setFollowing] = createSignal<string[]>([]);

const RelayContext: Context<IRelayContext> = createContext<IRelayContext>({
  relay: relay,
  publicKey: pk,
  following: following,
  setFollowing: setFollowing,
  defaultRelay: defaultRelay,
  relaysUrls: relayUrls,
  relayPool: relayPool
});

const RelayProvider: Component<{ children: JSX.Element }> = (props) => {
  onMount(async () => await fetchUserFollowing(relay, pk, setFollowing));

  return (
    <RelayContext.Provider
      value={{
        relay: relay,
        publicKey: pk,
        following: following,
        setFollowing: setFollowing,
        defaultRelay: defaultRelay,
        relaysUrls: relayUrls,
        relayPool: relayPool
      }}
    >
      {props.children}
    </RelayContext.Provider>
  );
};

export { RelayProvider, RelayContext };
