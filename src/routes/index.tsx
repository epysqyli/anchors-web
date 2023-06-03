import { useIsNarrow } from "~/hooks/useMediaQuery";
import { Component, createSignal, onMount, useContext } from "solid-js";
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

  return <EventWrapper isNarrow={isNarrow()} events={events()} />;
};

export default Home;
