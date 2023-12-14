import { Accessor, Setter } from "solid-js";
import Relayer from "~/lib/nostr/relayer";
import { AuthMode } from "~/types/AuthMode";

interface IRelayContext {
  relay: Relayer;
  readRelays: { get: Accessor<string[]>; set: Setter<string[]> };
  anchorsMode: { get: Accessor<boolean>; set: Setter<boolean> };
  authMode: { get: Accessor<AuthMode>; set: Setter<AuthMode> };
  guestPublicKey: { get: Accessor<string>; set: Setter<string>; localStorageKey: string };
  favoriteEventIDs: { get: Accessor<string[]>; set: Setter<string[]> };
  setupDone: Accessor<boolean>;
}

export default IRelayContext;
