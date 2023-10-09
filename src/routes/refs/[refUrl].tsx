import { Kind } from "nostr-tools";
import { useParams } from "solid-start";
import Feed from "~/components/feed/Feed";
import { RelayContext } from "~/contexts/relay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import LoadingFallback from "~/components/feed/LoadingFallback";
import { JSX, Show, VoidComponent, createSignal, onMount, useContext } from "solid-js";

const RefUrl: VoidComponent = (): JSX.Element => {
  const { relay, isAnchorsMode } = useContext(RelayContext);

  const [events, setEvents] = createSignal<IEnrichedEvent[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  const fetchAndSetEvents = async (): Promise<void> => {
    const params = useParams<{ refUrl: string }>();

    // manage limit and older posts
    const events = await relay.fetchTextEvents({
      rootOnly: true,
      isAnchorsMode: isAnchorsMode(),
      filter: { "#r": [params.refUrl] }
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

export default RefUrl;
