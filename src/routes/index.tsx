import { RelayContext } from "~/contexts/relay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import EventWrapper from "~/components/feed/EventWrapper";
import { IUserMetadata } from "~/interfaces/IUserMetadata";
import { Component, For, Show, createSignal, onMount, useContext } from "solid-js";
import { Event, Filter, Kind, Sub, validateEvent, verifySignature } from "nostr-tools";

const Home: Component<{}> = () => {
  const [events, setEvents] = createSignal<IEnrichedEvent[]>([]);
  const relay = useContext(RelayContext);
  const [eventWrapperContainer, setEventWrapperContainer] = createSignal<HTMLDivElement>();

  // createServerData$ until eose ?
  onMount(async () => {
    const filter: Filter = {};
    const sub: Sub = relay.sub([filter]);

    sub.on("eose", () => {
      // sub.unsub();
    });

    sub.on("event", (nostrEvent) => {
      const currentEvent = nostrEvent as Event;

      if (currentEvent.kind === Kind.Text && validateEvent(nostrEvent) && verifySignature(nostrEvent)) {
        const metaDataFilter: Filter = {
          authors: [currentEvent.pubkey],
          kinds: [Kind.Metadata]
        };

        let userMetadata: IUserMetadata;
        const metadataSub: Sub = relay.sub([metaDataFilter]);

        metadataSub.on("event", (metadataEvent) => {
          userMetadata = JSON.parse(metadataEvent.content);

          const enrichedEvent: IEnrichedEvent = {
            ...currentEvent,
            ...userMetadata
          };

          setEvents([...events(), enrichedEvent]);
        });
      }
    });
  });

  const scrollPage = (direction: "up" | "down"): void => {
    eventWrapperContainer()!.scrollBy({
      behavior: "smooth",
      top: direction == "up" ? -1000 : 1000
    });
  };

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
        <div
          ref={(el) => setEventWrapperContainer(el)}
          class='custom-scrollbar snap-y snap-mandatory overflow-scroll overflow-x-hidden h-full'
        >
          <For each={events()}>
            {(nostrEvent) => (
              <EventWrapper event={nostrEvent} isNarrow={useIsNarrow()} scrollPage={scrollPage} />
            )}
          </For>
        </div>
      </Show>
    </>
  );
};

export default Home;
