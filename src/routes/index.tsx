import { RelayContext } from "~/contexts/relay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import EventWrapper from "~/components/feed/EventWrapper";
import { IUserMetadata } from "~/interfaces/IUserMetadata";
import { Component, For, Show, createSignal, onMount, useContext } from "solid-js";
import { Event, Filter, Kind, Sub, validateEvent, verifySignature } from "nostr-tools";

const Home: Component<{}> = () => {
  const relay = useContext(RelayContext);

  const [events, setEvents] = createSignal<IEnrichedEvent[]>([]);
  const [eventWrapperContainer, setEventWrapperContainer] = createSignal<HTMLDivElement>();

  // TODO: manage incoming events after EOSE
  onMount(async () => {
    const eventsSub: Sub = relay.sub([{}]);

    eventsSub.on("event", (nostrEvent) => {
      const currentEvent = nostrEvent as Event;
      if (currentEvent.kind === Kind.Text && validateEvent(nostrEvent) && verifySignature(nostrEvent)) {
        setEvents([...events(), { ...currentEvent, name: "", picture: "", about: "" }]);
      }
    });

    eventsSub.on("eose", () => {
      const metadataFilter: Filter = {
        authors: [...new Set(events().map((e) => e.pubkey))],
        kinds: [Kind.Metadata]
      };

      const metadataSub: Sub = relay.sub([metadataFilter]);

      metadataSub.on("event", (metadataEvent) => {
        const userMetadata: IUserMetadata = JSON.parse(metadataEvent.content);

        const newEnrichedEvents = events()
          .filter((ev) => ev.pubkey === metadataEvent.pubkey)
          .map((ev) => {
            return {
              ...ev,
              about: userMetadata.about,
              name: userMetadata.name,
              picture: userMetadata.picture
            };
          });

        const remainingEvents = events().filter((ev) => ev.pubkey != metadataEvent.pubkey);
        setEvents([...remainingEvents, ...newEnrichedEvents]);
      });
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
