import { useIsNarrow } from "~/hooks/useMediaQuery";
import {
  Component,
  For,
  Show,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import { RelayContext } from "~/contexts/relay";
import {
  Event,
  Filter,
  Kind,
  Sub,
  validateEvent,
  verifySignature,
} from "nostr-tools";
import EventWrapper from "~/components/feed/EventWrapper";

const Home: Component<{}> = () => {
  const [events, setEvents] = createSignal<Event[]>([]);
  const [isNarrow, setIsNarrow] = createSignal<boolean | undefined>(undefined);
  useIsNarrow(setIsNarrow);

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

      if (
        currentEvent.kind === Kind.Text &&
        validateEvent(nostrEvent) &&
        verifySignature(nostrEvent)
      ) {
        setEvents([...events(), currentEvent]);
      }
    });
  });

  return (
    <>
      <Show when={isNarrow() !== undefined && isNarrow()}>
        <div class="snap-y snap-mandatory overflow-scroll overflow-x-hidden h-[100vh]">
          <For each={events()}>
            {(nostrEvent) => (
              <EventWrapper event={nostrEvent} isNarrow={isNarrow()} />
            )}
          </For>
        </div>
      </Show>

      <Show when={isNarrow() !== undefined && !isNarrow()}>
        <div class="custom-scrollbar snap-y snap-mandatory overflow-scroll overflow-x-hidden h-full">
          <For each={events()}>
            {(nostrEvent) => (
              <EventWrapper event={nostrEvent} isNarrow={isNarrow()} />
            )}
          </For>
        </div>
      </Show>
    </>
  );
};

export default Home;
