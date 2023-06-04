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
import EventWrapper from "~/components/EventWrapper";

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
              <div class="snap-start h-[100vh] text-white pt-10 mx-auto w-11/12">
                <div class="h-[70vh] px-10 text-justify overflow-auto break-words">
                  {nostrEvent.content}
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      <Show when={isNarrow() !== undefined && !isNarrow()}>
        <div class="custom-scrollbar snap-y snap-mandatory overflow-scroll overflow-x-hidden h-full">
          <For each={events()}>
            {(nostrEvent) => (
              <div class="snap-start h-full text-white text-xl px-10 pt-10 mx-auto w-4/5 2xl:w-3/5 2xl:p-16 rounded-md">
                <div class="custom-scrollbar h-[70vh] overflow-auto pr-10 break-words text-justify">
                  {nostrEvent.content}
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </>
  );
};

export default Home;
