import { RelayContext } from "~/contexts/relay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import EventWrapper from "~/components/feed/EventWrapper";
import { Component, For, Show, createSignal, onMount, useContext } from "solid-js";
import { Event, Filter, Kind, Sub, validateEvent, verifySignature } from "nostr-tools";

const Home: Component<{}> = () => {
  const [events, setEvents] = createSignal<Event[]>([]);
  const relay = useContext(RelayContext);

  // createServerData$ until eose ?
  onMount(async () => {
    const filter: Filter = {};
    const sub: Sub = relay.sub([filter]);

    sub.on("eose", () => {
      // sub.unsub();
      // console.log(events());
    });

    sub.on("event", (nostrEvent) => {
      const currentEvent = nostrEvent as Event;
      if (currentEvent.content.startsWith("Another")) {
        currentEvent.content = "Fake stuff being introduced.";
      }

      if (currentEvent.kind === Kind.Text && validateEvent(nostrEvent) && verifySignature(nostrEvent)) {
        setEvents([...events(), currentEvent]);
      }
    });
  });

  return (
    <>
      <Show when={useIsNarrow() !== undefined && useIsNarrow()}>
        <div class='snap-y snap-mandatory overflow-scroll overflow-x-hidden h-[100vh]'>
          <For each={events()}>
            {(nostrEvent) => <EventWrapper event={nostrEvent} isNarrow={useIsNarrow()} />}
          </For>
        </div>
      </Show>

      <Show when={useIsNarrow() !== undefined && !useIsNarrow()}>
        <div class='custom-scrollbar snap-y snap-mandatory overflow-scroll overflow-x-hidden h-full'>
          <For each={events()}>
            {(nostrEvent) => <EventWrapper event={nostrEvent} isNarrow={useIsNarrow()} />}
          </For>
        </div>
      </Show>
    </>
  );
};

export default Home;
