import "websocket-polyfill";
import Relayer from "~/lib/nostr/relayer";
import type { Accessor, Setter } from "solid-js";
import { getPublicKeyFromExt } from "~/lib/nostr/nostr-utils";
import { Component, JSX, createContext, createEffect, createSignal } from "solid-js";

const LOCAL_STORAGE_GUEST_PK = "anchors-guest-public-key";

const [getReadRelays, setReadRelays] = createSignal<string[]>([]);
const [getAnchorsMode, setAnchorsMode] = createSignal<boolean>(true);
const [guestPublicKey, setGuestPublicKey] = createSignal<string>("");
const [favoriteEventIDs, setFavoriteEventIDs] = createSignal<string[]>([]);

let relay: Relayer = new Relayer();
const userPublicKeyFromExt = await getPublicKeyFromExt();

if (userPublicKeyFromExt) {
  relay = new Relayer(userPublicKeyFromExt);
  await relay.fetchAndSetRelays();
  setReadRelays(relay.getReadRelays());
  relay.following = await relay.fetchContacts();
  setFavoriteEventIDs(await relay.fetchFavoriteEventsIDs());
}

type AuthMode = "guest" | "public" | "private";
const [authMode, setAuthMode] = createSignal<AuthMode>(userPublicKeyFromExt ? "private" : "guest");

interface IRelayContext {
  relay: Relayer;
  readRelays: { get: Accessor<string[]>; set: Setter<string[]> };
  anchorsMode: { get: Accessor<boolean>; set: Setter<boolean> };
  authMode: { get: Accessor<AuthMode>; set: Setter<AuthMode> };
  guestPublicKey: { get: Accessor<string>; set: Setter<string>; localStorageKey: string };
  favoriteEventIDs: { get: Accessor<string[]>; set: Setter<string[]> };
}

const RelayContext = createContext<IRelayContext>({
  relay: relay,
  readRelays: { get: getReadRelays, set: setReadRelays },
  anchorsMode: { get: getAnchorsMode, set: setAnchorsMode },
  authMode: { get: authMode, set: setAuthMode },
  guestPublicKey: { get: guestPublicKey, set: setGuestPublicKey, localStorageKey: LOCAL_STORAGE_GUEST_PK },
  favoriteEventIDs: { get: favoriteEventIDs, set: setFavoriteEventIDs }
});

const RelayProvider: Component<{ children: JSX.Element }> = (props) => {
  createEffect(async () => {
    if (guestPublicKey()) {
      relay.userPubKey = guestPublicKey();
      await relay.fetchAndSetRelays();
      setReadRelays(relay.getReadRelays());
      relay.following = await relay.fetchContacts();
    }
  });

  return (
    <RelayContext.Provider
      value={{
        relay: relay,
        readRelays: { get: getReadRelays, set: setReadRelays },
        anchorsMode: { get: getAnchorsMode, set: setAnchorsMode },
        authMode: { get: authMode, set: setAuthMode },
        favoriteEventIDs: { get: favoriteEventIDs, set: setFavoriteEventIDs },
        guestPublicKey: {
          get: guestPublicKey,
          set: setGuestPublicKey,
          localStorageKey: LOCAL_STORAGE_GUEST_PK
        }
      }}
    >
      {props.children}
    </RelayContext.Provider>
  );
};

export { RelayProvider, RelayContext };
