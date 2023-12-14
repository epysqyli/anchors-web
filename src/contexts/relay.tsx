import "websocket-polyfill";
import Relayer from "~/lib/nostr/relayer";
import { AuthMode } from "~/types/AuthMode";
import IRelayContext from "~/interfaces/RelayContext";
import { Component, JSX, createContext, createEffect, createSignal, onMount } from "solid-js";

const LOCAL_STORAGE_GUEST_PK = "anchors-guest-public-key";

const [relay] = createSignal<Relayer>(new Relayer(""));
const [setupDone, setSetupDone] = createSignal<boolean>(false);
const [authMode, setAuthMode] = createSignal<AuthMode>("guest");
const [getReadRelays, setReadRelays] = createSignal<string[]>([]);
const [getAnchorsMode, setAnchorsMode] = createSignal<boolean>(true);
const [guestPublicKey, setGuestPublicKey] = createSignal<string>("");
const [favoriteEventIDs, setFavoriteEventIDs] = createSignal<string[]>([]);

const RelayContext = createContext<IRelayContext>({
  relay: relay(),
  readRelays: { get: getReadRelays, set: setReadRelays },
  anchorsMode: { get: getAnchorsMode, set: setAnchorsMode },
  authMode: { get: authMode, set: setAuthMode },
  guestPublicKey: { get: guestPublicKey, set: setGuestPublicKey, localStorageKey: LOCAL_STORAGE_GUEST_PK },
  favoriteEventIDs: { get: favoriteEventIDs, set: setFavoriteEventIDs },
  setupDone: setupDone
});

const RelayProvider: Component<{ children: JSX.Element }> = (props) => {
  onMount(async () => {
    let userPublicKey: string = "";
    try {
      userPublicKey = await window.nostr.getPublicKey();
    } catch (error) {}

    await relay().fetchAndSetRelays();
    setReadRelays(relay().getReadRelays());

    if (userPublicKey) {
      relay().userPubKey = userPublicKey;
      setAuthMode("private");
      await relay().fetchAndSetRelays();
      await relay().fetchUserMetadata();
      relay().following = await relay().fetchContacts();
      setFavoriteEventIDs(await relay().fetchFavoriteEventsIDs());
      setReadRelays(relay().getReadRelays());
    }

    setSetupDone(true);
  });

  createEffect(async () => {
    if (guestPublicKey()) {
      setSetupDone(false);
      relay().userPubKey = guestPublicKey();
      setAuthMode("guest");
      await relay().fetchAndSetRelays();
      await relay().fetchUserMetadata();
      relay().following = await relay().fetchContacts();
      setFavoriteEventIDs(await relay().fetchFavoriteEventsIDs());
      setReadRelays(relay().getReadRelays());
      setSetupDone(true);
    }
  });

  return (
    <RelayContext.Provider
      value={{
        relay: relay(),
        setupDone: setupDone,
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
