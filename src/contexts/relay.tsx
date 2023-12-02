import "websocket-polyfill";
import Relayer from "~/lib/nostr/relayer";
import type { Accessor, Setter } from "solid-js";
import { Component, JSX, createContext, createEffect, createSignal, onMount } from "solid-js";

type AuthMode = "guest" | "public" | "private";
const LOCAL_STORAGE_GUEST_PK = "anchors-guest-public-key";

const [relay] = createSignal<Relayer>(new Relayer(''));
const [getReadRelays, setReadRelays] = createSignal<string[]>([]);
const [getAnchorsMode, setAnchorsMode] = createSignal<boolean>(true);
const [guestPublicKey, setGuestPublicKey] = createSignal<string>("");
const [favoriteEventIDs, setFavoriteEventIDs] = createSignal<string[]>([]);
const [authMode, setAuthMode] = createSignal<AuthMode>("guest");

await relay().fetchAndSetRelays();
setReadRelays(relay().getReadRelays());

interface IRelayContext {
  relay: Relayer;
  readRelays: { get: Accessor<string[]>; set: Setter<string[]> };
  anchorsMode: { get: Accessor<boolean>; set: Setter<boolean> };
  authMode: { get: Accessor<AuthMode>; set: Setter<AuthMode> };
  guestPublicKey: { get: Accessor<string>; set: Setter<string>; localStorageKey: string };
  favoriteEventIDs: { get: Accessor<string[]>; set: Setter<string[]> };
}

const RelayContext = createContext<IRelayContext>({
  relay: relay(),
  readRelays: { get: getReadRelays, set: setReadRelays },
  anchorsMode: { get: getAnchorsMode, set: setAnchorsMode },
  authMode: { get: authMode, set: setAuthMode },
  guestPublicKey: { get: guestPublicKey, set: setGuestPublicKey, localStorageKey: LOCAL_STORAGE_GUEST_PK },
  favoriteEventIDs: { get: favoriteEventIDs, set: setFavoriteEventIDs }
});

const RelayProvider: Component<{ children: JSX.Element }> = (props) => {
  onMount(async () => {
    let userPublicKey: string = "";
    try {
      userPublicKey = await window.nostr.getPublicKey();
    } catch (error) {}

    if (userPublicKey) {
      relay().userPubKey = userPublicKey;
      setAuthMode("private");
      await relay().fetchAndSetRelays();
      await relay().fetchUserMetadata();
      relay().following = await relay().fetchContacts();
      setFavoriteEventIDs(await relay().fetchFavoriteEventsIDs());
      setReadRelays(relay().getReadRelays());
    }
  });

  createEffect(async () => {
    if (guestPublicKey()) {
      relay().userPubKey = guestPublicKey();
      setAuthMode("guest");
      await relay().fetchAndSetRelays();
      await relay().fetchUserMetadata();
      relay().following = await relay().fetchContacts();
      setFavoriteEventIDs(await relay().fetchFavoriteEventsIDs());
      setReadRelays(relay().getReadRelays());
    }
  });

  return (
    <RelayContext.Provider
      value={{
        relay: relay(),
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
