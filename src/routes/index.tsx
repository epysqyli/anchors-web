import Feed from "~/components/feed/Feed";
import { RelayContext } from "~/contexts/relay";
import { Event, Filter, Kind } from "nostr-tools";
import { FeedSearchParams } from "~/types/FeedSearchParams";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { IReactionWithEventID } from "~/interfaces/IReaction";
import LoadingPoints from "~/components/feed/LoadingPoints";
import { useBeforeLeave, useSearchParams } from "@solidjs/router";
import { IUserMetadataWithPubkey } from "~/interfaces/IUserMetadata";
import { sortByCreatedAt, sortByCreatedAtReverse } from "~/lib/nostr/nostr-utils";
import { Component, Show, createEffect, createSignal, onMount, useContext } from "solid-js";

const Home: Component<{}> = () => {
  const FETCH_EVENTS_LIMIT = 33;
  const MAX_EVENTS_COUNT = 75;

  const { relay, isAnchorsMode } = useContext(RelayContext);

  const [searchParams, setSearchParams] = useSearchParams<FeedSearchParams>();
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [showPopup, setShowPopup] = createSignal<boolean>(false);

  let intervalID: NodeJS.Timer | undefined = undefined;
  const [events, setEvents] = createSignal<Event[]>([]);
  const [metaEvents, setMetaEvents] = createSignal<IUserMetadataWithPubkey[]>([]);
  const [reactions, setReactions] = createSignal<IReactionWithEventID[]>([]);
  const [enrichedEvents, setEnrichedEvents] = createSignal<IEnrichedEvent[]>([]);
  const [newEnrichedEvents, setNewEnrichedEvents] = createSignal<IEnrichedEvent[]>([]);

  const fetchAndSetEvents = async (): Promise<void> => {
    setIsLoading(true);
    if (intervalID) {
      clearInterval(intervalID);
    }

    setEvents(
      await relay.fetchTextEvents({
        rootOnly: true,
        isAnchorsMode: isAnchorsMode(),
        feedSearchParams: searchParams,
        filter: { limit: FETCH_EVENTS_LIMIT }
      })
    );

    let metaFilter: Filter = { authors: [...new Set(events().map((evt) => evt.pubkey))] };
    if (searchParams.following == "on") {
      metaFilter = { authors: relay.following };
    }

    setMetaEvents(await relay.fetchEventsMetadata(metaFilter));

    const reactionsFilter: Filter[] = events().map((evt) => {
      return { kinds: [Kind.Reaction], "#e": [evt.id] };
    });

    setReactions(await relay.fetchEventsReactions(reactionsFilter));
    setEnrichedEvents(relay.buildEnrichedEvents(events(), metaEvents(), reactions()));

    setIsLoading(false);

    const intervalIdentifier = setInterval(async () => {
      let fetchSinceTimestamp = Math.floor(Date.now() / 1000);

      if (newEnrichedEvents().length || enrichedEvents().length) {
        fetchSinceTimestamp =
          newEnrichedEvents().length == 0
            ? enrichedEvents()[0].created_at
            : newEnrichedEvents()[0].created_at;
      }

      const newEvents: Event[] = await relay.fetchTextEvents({
        rootOnly: true,
        isAnchorsMode: isAnchorsMode(),
        feedSearchParams: searchParams,
        filter: { limit: FETCH_EVENTS_LIMIT, since: fetchSinceTimestamp + 1 }
      });

      if (newEvents.length !== 0) {
        const newEventsIDs = newEvents.map((e) => e.id);
        const oldEventsIDs = events().map((e) => e.id);
        const uniqueNewEventsIDs = newEventsIDs.filter((newID) => !oldEventsIDs.includes(newID));
        const newUniqueEvents = newEvents.filter((newEvt) => uniqueNewEventsIDs.includes(newEvt.id));

        setEvents([...events(), ...newUniqueEvents]);

        const newEventsAuthors: string[] = newUniqueEvents.map((e) => e.pubkey);
        const oldEventsAuthors: string[] = events().map((e) => e.pubkey);
        const diffAuthors: string[] = newEventsAuthors.filter((newPk) =>
          oldEventsAuthors.find((oldPk) => oldPk !== newPk)
        );

        if (diffAuthors.length !== 0) {
          let metaFilter: Filter = { authors: [...new Set(diffAuthors)] };
          const recentMetaEvents: IUserMetadataWithPubkey[] = await relay.fetchEventsMetadata(metaFilter);
          setMetaEvents([...metaEvents(), ...recentMetaEvents]);
        }

        const reactionsFilter: Filter[] = newUniqueEvents.map((evt) => {
          return { kinds: [Kind.Reaction], "#e": [evt.id] };
        });

        const recentReactions: IReactionWithEventID[] = await relay.fetchEventsReactions(reactionsFilter);
        const newReactions: IReactionWithEventID[] = recentReactions.filter(
          (re) => !reactions().find((r) => r.eventID === re.eventID)
        );

        setReactions([...reactions(), ...newReactions]);

        const newEventsCount = newEnrichedEvents().length + newUniqueEvents.length;
        if (newEventsCount >= MAX_EVENTS_COUNT) {
          const newEventsToSet = [
            ...newEnrichedEvents(),
            ...relay.buildEnrichedEvents(newUniqueEvents, metaEvents(), reactions())
          ]
            .sort(sortByCreatedAtReverse)
            .slice(newEventsCount - MAX_EVENTS_COUNT, newEventsCount);

          setNewEnrichedEvents(newEventsToSet);
        } else {
          setNewEnrichedEvents([
            ...newEnrichedEvents(),
            ...relay.buildEnrichedEvents(newUniqueEvents, metaEvents(), reactions())
          ]);
        }

        setShowPopup(true);
      }
    }, relay.FETCH_INTERVAL_MS);

    intervalID = intervalIdentifier;
  };

  onMount(async () => {
    if (searchParams.following == undefined || searchParams.following == "undefined") {
      setSearchParams({ ...searchParams, following: "on" });
    }

    if (searchParams.relayAddress == undefined || searchParams.relayAddress == "undefined") {
      setSearchParams({ ...searchParams, relayAddress: "all" });
    }

    await fetchAndSetEvents();
  });

  createEffect(async () => {
    isAnchorsMode();
    clearInterval(intervalID);

    setEvents([]);
    setEnrichedEvents([]);
    setNewEnrichedEvents([]);
    setMetaEvents([]);
    setReactions([]);
    setShowPopup(false);

    await fetchAndSetEvents();
  });

  useBeforeLeave(() => {
    clearInterval(intervalID);
  });

  const mergeEnrichedEvents = (): void => {
    const eventsCount = enrichedEvents().length + newEnrichedEvents().length;
    const eventsToSet = [...enrichedEvents(), ...newEnrichedEvents()].sort(sortByCreatedAtReverse);

    if (eventsCount > MAX_EVENTS_COUNT) {
      setEnrichedEvents(eventsToSet.slice(eventsCount - MAX_EVENTS_COUNT, eventsCount).sort(sortByCreatedAt));
    } else {
      setEnrichedEvents([...enrichedEvents(), ...newEnrichedEvents()].sort(sortByCreatedAt));
    }

    setNewEnrichedEvents([]);
  };

  return (
    <>
      <Show when={!isLoading()} fallback={<LoadingPoints />}>
        <Feed
          isLiveFeed={true}
          enrichedEvents={enrichedEvents}
          mergeEnrichedEvents={mergeEnrichedEvents}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
        />
      </Show>
    </>
  );
};

export default Home;
