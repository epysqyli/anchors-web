import "websocket-polyfill";
import Relayer from "~/lib/nostr/relayer";
import type { Accessor, Context, Setter } from "solid-js";
import { getPublicKeyFromExt } from "~/lib/nostr/nostr-utils";
import { Component, JSX, createContext, createSignal } from "solid-js";

const [getReadRelays, setReadRelays] = createSignal<string[]>([]);
const [getAnchorsMode, setAnchorsMode] = createSignal<boolean>(true);

let relay: Relayer = new Relayer();
const pk = await getPublicKeyFromExt();

if (pk) {
  relay = new Relayer(pk);
  await relay.fetchAndSetRelays();
  setReadRelays(relay.getReadRelays());
  relay.following = await relay.fetchContacts();
}

interface IRelayContext {
  relay: Relayer;
  readRelays: { get: Accessor<string[]>; set: Setter<string[]> };
  anchorsMode: { get: Accessor<boolean>; set: Setter<boolean> };
}

const RelayContext: Context<IRelayContext> = createContext({
  relay: relay,
  readRelays: { get: getReadRelays, set: setReadRelays },
  anchorsMode: { get: getAnchorsMode, set: setAnchorsMode }
});

const RelayProvider: Component<{ children: JSX.Element }> = (props) => {
  return (
    <RelayContext.Provider
      value={{
        relay: relay,
        readRelays: { get: getReadRelays, set: setReadRelays },
        anchorsMode: { get: getAnchorsMode, set: setAnchorsMode }
      }}
    >
      {props.children}
    </RelayContext.Provider>
  );
};

export { RelayProvider, RelayContext };
