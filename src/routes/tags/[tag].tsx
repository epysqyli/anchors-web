import { Kind } from "nostr-tools";
import { JSX, Show, VoidComponent, createEffect, createSignal, onMount, useContext } from "solid-js";
import { useParams } from "solid-start";
import Feed from "~/components/feed/Feed";
import LoadingFallback from "~/components/feed/LoadingFallback";
import { RelayContext } from "~/contexts/relay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";

const Tag: VoidComponent = (): JSX.Element => {
  const params = useParams<{ tag: string }>();

  const { relay, isAnchorsMode } = useContext(RelayContext);

  const [events, setEvents] = createSignal<IEnrichedEvent[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  // manage limit and older posts
  const fetchAndSetEvents = async (): Promise<void> => {
    const events = await relay.fetchTextEvents({
      rootOnly: true,
      isAnchorsMode: isAnchorsMode(),
      filter: { "#t": [params.tag], limit: 30 }
    });

    const metadata = await relay.fetchEventsMetadata({ authors: events.map((evt) => evt.pubkey) });
    const reactions = await relay.fetchEventsReactions([
      { kinds: [Kind.Reaction], "#e": events.map((evt) => evt.id) }
    ]);

    setEvents(relay.buildEnrichedEvents(events, metadata, reactions));
  };

  onMount(async () => {
    setIsLoading(true);
    await fetchAndSetEvents();
    setIsLoading(false);
  });

  createEffect(async () => {
    isAnchorsMode();
    setEvents([]);
    await fetchAndSetEvents();
  });

  return (
    <>
      <Show
        when={!isLoading() && useIsNarrow() !== undefined && !useIsNarrow() && events().length > 0}
        fallback={<LoadingFallback />}
      >
        <Feed enrichedEvents={events} isLiveFeed={false} />
      </Show>
    </>
  );
};

export default Tag;
