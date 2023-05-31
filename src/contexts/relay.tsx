import type { Context } from "solid-js";
import { Relay, relayInit } from "nostr-tools";
import { Component, JSX, createContext } from "solid-js";

const relay = relayInit("ws://localhost:2700");
const RelayContext: Context<Relay> = createContext<Relay>(relay);

const RelayProvider: Component<{ children: JSX.Element }> = (props) => {
  return (
    <RelayContext.Provider value={relay}>
      {props.children}
    </RelayContext.Provider>
  );
};

export { RelayProvider, RelayContext };
