import "websocket-polyfill";
import type { Context } from "solid-js";
import Relayer from "~/lib/nostr/relayer";
import { Component, JSX, createContext } from "solid-js";
import { getPublicKeyFromExt } from "~/lib/nostr/nostr-utils";

interface IRelayContext {
  relay: Relayer;
}

let relay: Relayer = new Relayer();

const pk = await getPublicKeyFromExt();

if (pk) {
  relay = new Relayer(pk);
  const kindThreeEvent = await relay.fetchAndUnsubKindThreeEvent();

  if (kindThreeEvent.content !== "") {
    relay.relaysUrls = kindThreeEvent.content.split(";").filter((el) => el != "");
  }

  relay.following = kindThreeEvent.tags.map((e) => e[1]);
}

const RelayContext: Context<IRelayContext> = createContext<IRelayContext>({
  relay: relay
});

const RelayProvider: Component<{ children: JSX.Element }> = (props) => {
  return <RelayContext.Provider value={{ relay: relay }}>{props.children}</RelayContext.Provider>;
};

export { RelayProvider, RelayContext };
