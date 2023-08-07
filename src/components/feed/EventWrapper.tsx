import Reactions from "./Reactions";
import { A } from "@solidjs/router";
import EventAuthor from "./EventAuthor";
import { useLocation } from "solid-start";
import EventContent from "./EventContent";
import { FiTrendingUp } from "solid-icons/fi";
import { Event, Kind, Sub } from "nostr-tools";
import { RelayContext } from "~/contexts/relay";
import EventReferences from "./EventReferences";
import { parseDate } from "~/lib/nostr/nostr-utils";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import { VsCommentDiscussion } from "solid-icons/vs";
import { BiRegularBoltCircle } from "solid-icons/bi";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { fetchMovie } from "~/lib/external-services/tmdb";
import { FiChevronDown, FiChevronUp } from "solid-icons/fi";
import { fetchSong } from "~/lib/external-services/spotify";
import { parseReferenceType } from "~/lib/ref-tags/references";
import { fetchBook } from "~/lib/external-services/open-library";
import { IReaction, IReactionFields, Reaction } from "~/interfaces/IReaction";
import { deleteNostrEvent, reactToEvent } from "~/lib/nostr/nostr-nips-actions";
import { Component, For, Show, createSignal, onMount, useContext } from "solid-js";
import EventAnchor from "./EventAnchor";
import EventScroller from "./EventScroller";

interface Props {
  event: IEnrichedEvent;
  scrollPage?(direction: "up" | "down"): void;
  addHtmlRef?(ref: HTMLDivElement, eventID: string, createdAt: number): void;
}

const EventWrapper: Component<Props> = (props) => {
  const { relay, publicKey } = useContext(RelayContext);

  const nostrEvent = () => props.event;
  const [isLoading, setIsLoading] = createSignal<boolean>(true);

  const [eventRefTags, setEventRefTags] = createSignal<IFeedRefTag[]>([]);

  const [reactions, setReactions] = createSignal<IReaction>({
    positive: nostrEvent().positive,
    negative: nostrEvent().negative
  });

  const handleEventHtmlRef = (el: HTMLDivElement): void => {
    if (props.addHtmlRef !== undefined) {
      props.addHtmlRef(el, nostrEvent().id, nostrEvent().created_at);
    }
  };

  const handleReaction = async (reaction: Reaction): Promise<void> => {
    let reactionType = "";
    if (reaction == "+") {
      reactionType = "positive";
    } else if (reaction == "-") {
      reactionType = "negative";
    }

    const eventToDelete = reactions()[reactionType as keyof IReaction].events.find(
      (evt) => evt.pubkey === publicKey
    );

    if (eventToDelete) {
      await deleteNostrEvent(relay, eventToDelete.eventID);

      const newReactions: IReactionFields = {
        count: reactions()[reactionType as keyof IReaction].count - 1,
        events: reactions()[reactionType as keyof IReaction].events.filter(
          (e) => e.eventID !== eventToDelete.eventID
        )
      };

      setReactions({ ...reactions(), [reactionType]: newReactions });
    } else {
      await reactToEvent(relay, nostrEvent().id, nostrEvent().pubkey, reaction);
    }
  };

  onMount(async () => {
    const reactionsSub: Sub = relay.sub([{ kinds: [Kind.Reaction], "#e": [nostrEvent().id] }]);

    reactionsSub.on("event", (evt: Event) => {
      let reactionType = "";
      if (evt.content == "+") {
        reactionType = "positive";
      } else if (evt.content == "-") {
        reactionType = "negative";
      }

      const alreadyReacted = reactions()[reactionType as keyof IReaction].events.find(
        (evt) => evt.pubkey === publicKey
      );

      if (!alreadyReacted) {
        const newReactions: IReactionFields = {
          count: reactions()[reactionType as keyof IReaction].count + 1,
          events: [
            ...reactions()[reactionType as keyof IReaction].events,
            { eventID: evt.id, pubkey: evt.pubkey }
          ]
        };

        setReactions({ ...reactions(), [reactionType]: newReactions });
      }
    });

    const referenceTags = nostrEvent().tags.filter((t) => t[0] == "r");

    for (const refTag of referenceTags) {
      switch (parseReferenceType(refTag[1])) {
        case "movie":
          const movieID = refTag[1].split("/")[refTag[1].split("/").length - 1];
          setEventRefTags([...eventRefTags(), await fetchMovie(movieID, refTag[1])]);
          break;

        case "book":
          const bookID = refTag[1].split("/")[refTag[1].split("/").length - 1];
          setEventRefTags([...eventRefTags(), await fetchBook(bookID, refTag[1])]);
          break;

        case "song":
          const songID = refTag[1].split("/")[refTag[1].split("/").length - 1];
          setEventRefTags([...eventRefTags(), await fetchSong(songID, refTag[1])]);
          break;

        case "video":
          const videoRefTag: IFeedRefTag = {
            preview: "",
            primaryInfo: "",
            secondaryInfo: "",
            url: refTag[1],
            category: "video"
          };

          setEventRefTags([...eventRefTags(), videoRefTag]);
          break;

        case "generic":
          const genericRefTag: IFeedRefTag = {
            preview: "",
            primaryInfo: "",
            secondaryInfo: "",
            url: refTag[1],
            category: "generic"
          };

          setEventRefTags([...eventRefTags(), genericRefTag]);
          break;
      }
    }

    setIsLoading(false);
  });

  return (
    <>
      <Show when={useIsNarrow() !== undefined && useIsNarrow()}>
        <div class='snap-start h-[100vh] text-white pt-4 mx-auto'>
          <div class='h-[60vh] w-11/12 mx-auto py-2 pr-5 mb-10 text-justify overflow-auto break-words shadow-inner'>
            {nostrEvent().content}
          </div>
          <div class='mb-10 w-11/12 mx-auto pb-5 snap-x snap-mandatory overflow-scroll flex justify-start gap-x-10'>
            <For each={nostrEvent().tags}>
              {(tag) => (
                <div class='snap-center w-4/5 px-5 py-1 flex items-center bg-slate-300 rounded'>
                  <div class='w-1/4'>
                    <BiRegularBoltCircle size={40} color='#334155' />
                  </div>
                  <div class='break-words w-3/4 px-2 text-sm text-slate-700'>{tag[1]}</div>
                </div>
              )}
            </For>
          </div>

          <div class='flex items-center justify-between w-4/5 mx-auto'>
            <div class='border-b pb-2'>comments</div>
            <div class='border-b pb-2'>reactions</div>
          </div>
        </div>
      </Show>

      <Show when={useIsNarrow() !== undefined && !useIsNarrow()}>
        <div
          ref={handleEventHtmlRef}
          class='snap-start h-full text-white text-lg mx-auto rounded-md px-3 py-1 gap-y-3 flex flex-col justify-between'
        >
          <div class='grid grid-cols-5 h-[85%] gap-x-3'>
            <EventContent content={nostrEvent().content} />

            <div class='col-span-1 xl:col-span-2 h-full overflow-auto no-scrollbar rounded-md bg-slate-800'>
              <EventReferences eventRefTags={eventRefTags} isLoading={isLoading} />
            </div>
          </div>

          <div class='w-full grow mx-auto flex justify-around items-center rounded-md py-5 bg-slate-600 bg-opacity-40'>
            <div class='w-1/6 pl-5'>
              <EventAuthor
                name={nostrEvent().name}
                about={nostrEvent().about}
                picture={nostrEvent().picture}
                pubKey={nostrEvent().pubkey}
              />

              <div class='text-sm text-slate-400 mt-3'>{parseDate(nostrEvent().created_at)}</div>
            </div>

            <EventAnchor nostrEventID={nostrEvent().id} />
            <Reactions reactions={reactions} publicKey={publicKey} handleReaction={handleReaction} />
            <FiTrendingUp class='text-slate-400' size={26} />
            <VsCommentDiscussion class='text-slate-400' size={28} />
            <EventScroller scrollPage={props.scrollPage} />
          </div>
        </div>
      </Show>
    </>
  );
};

export default EventWrapper;
