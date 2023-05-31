import Main from "~/components/Main";
import Menu from "~/components/Menu";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import { Component, Show, createSignal, onMount, useContext } from "solid-js";
import { RelayContext } from "~/contexts/relay";
import {
  Event,
  Filter,
  Kind,
  Sub,
  validateEvent,
  verifySignature,
} from "nostr-tools";

const Home: Component<{}> = () => {
  const [events, setEvents] = createSignal<Event[]>([]);
  const [isNarrow, setIsNarrow] = createSignal<boolean | undefined>(undefined);

  const relay = useContext(RelayContext);

  // createServerData$ ?
  onMount(async () => {
    await relay.connect();

    const filter: Filter = {};
    const sub: Sub = relay.sub([filter]);

    sub.on("eose", () => {
      // sub.unsub();
    });

    sub.on("event", (nostrEvent) => {
      const currentEvent = nostrEvent as Event;
      if (currentEvent.content.startsWith("Another")) {
        currentEvent.content = "Fake stuff being introduced.";
      }

      if (
        currentEvent.kind === Kind.Text &&
        validateEvent(nostrEvent) &&
        verifySignature(nostrEvent)
      ) {
        setEvents([...events(), currentEvent]);
      }
    });
  });

  useIsNarrow(setIsNarrow);

  return (
    <>
      <Show when={isNarrow() !== undefined && isNarrow()}>
        <>
          <Main isNarrow={isNarrow()} events={events()} />
        </>
      </Show>

      <Show when={isNarrow() !== undefined && !isNarrow()}>
        <div class="h-screen flex gap-x-3 px-2 2xl:gap-x-4 2xl:px-5 justify-center items-center">
          <div class="h-[96vh] w-1/5">
            <Menu isNarrow={isNarrow()} />
          </div>

          <div class="h-[96vh] w-4/5">
            <Main isNarrow={isNarrow()} events={events()} />
          </div>
        </div>
      </Show>
    </>
  );
};

export default Home;
