import type { Context } from "solid-js";
import "websocket-polyfill";
import { Relay, relayInit } from "nostr-tools";
import { Component, JSX, createContext } from "solid-js";

interface IRelayContext {
  relay: Relay;
  publicKey: string;
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

/**
 * Should user following be defined in this context?
 * Necessary for <UserPopup /> actions
 */
const RelayContext: Context<IRelayContext> = createContext<IRelayContext>({
  relay: relay,
  publicKey: pk
});

const RelayProvider: Component<{ children: JSX.Element }> = (props) => {
  return (
    <RelayContext.Provider value={{ relay: relay, publicKey: pk }}>{props.children}</RelayContext.Provider>
  );
};

export { RelayProvider, RelayContext };
