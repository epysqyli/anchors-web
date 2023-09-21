import Reactions from "./Reactions";
import Popup from "../shared/Popup";
import UserPopup from "./UserPopup";
import EventAnchor from "./EventAnchor";
import EventAuthor from "./EventAuthor";
import EventContent from "./EventContent";
import EventScroller from "./EventScroller";
import CommmentsPopup from "./CommentsPopup";
import { FiTrendingUp } from "solid-icons/fi";
import { RelayContext } from "~/contexts/relay";
import EventReferences from "./EventReferences";
import { parseDate } from "~/lib/nostr/nostr-utils";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import { VsCommentDiscussion } from "solid-icons/vs";
import { BiRegularBoltCircle } from "solid-icons/bi";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { fetchMovie } from "~/lib/external-services/tmdb";
import { fetchSong } from "~/lib/external-services/spotify";
import { parseReferenceType } from "~/lib/ref-tags/references";
import { fetchBook } from "~/lib/external-services/open-library";
import { IReaction, IReactionFields, Reaction } from "~/interfaces/IReaction";
import { Component, For, Show, createSignal, onMount, useContext } from "solid-js";

interface Props {
  event: IEnrichedEvent;
  scrollPage?(direction: "up" | "down"): void;
  addHtmlRef?(ref: HTMLDivElement, eventID: string, createdAt: number): void;
}

const EventWrapper: Component<Props> = (props) => {
  const { relay } = useContext(RelayContext);

  const nostrEvent = () => props.event;
  const [isLoading, setIsLoading] = createSignal<boolean>(true);
  const [eventRefTags, setEventRefTags] = createSignal<IFeedRefTag[]>([]);
  const [showUserPopup, setShowUserPopup] = createSignal<boolean>(false);
  const [showCommentsPopup, setShowCommentsPopup] = createSignal<boolean>(false);

  const [reactions, setReactions] = createSignal<IReaction>({
    positive: nostrEvent().positive,
    negative: nostrEvent().negative
  });

  const handleReaction = async (reaction: Reaction): Promise<void> => {
    let reactionType = "";
    if (reaction == "+") {
      reactionType = "positive";
    } else if (reaction == "-") {
      reactionType = "negative";
    }

    const eventToDelete = reactions()[reactionType as keyof IReaction].events.find(
      (evt) => evt.pubkey === relay.userPubKey
    );

    if (eventToDelete) {
      const pubResult = await relay.deleteEvent(eventToDelete.eventID);

      if (pubResult.error) {
        console.log("Reaction not sent correctly");
        return;
      }

      const newReactions: IReactionFields = {
        count: reactions()[reactionType as keyof IReaction].count - 1,
        events: reactions()[reactionType as keyof IReaction].events.filter(
          (e) => e.eventID !== eventToDelete.eventID
        )
      };

      setReactions({ ...reactions(), [reactionType]: newReactions });
    } else {
      const pubResult = await relay.reactToEvent(nostrEvent().id, nostrEvent().pubkey, reaction);

      if (pubResult.error) {
        console.log("Reaction not sent correctly");
        return;
      }

      const newReactions: IReactionFields = {
        count: reactions()[reactionType as keyof IReaction].count + 1,
        events: [
          ...reactions()[reactionType as keyof IReaction].events,
          { pubkey: pubResult.event.pubkey, eventID: pubResult.event.id }
        ]
      };

      setReactions({ ...reactions(), [reactionType]: newReactions });
    }
  };

  const handleEventHtmlRef = (el: HTMLDivElement): void => {
    if (props.addHtmlRef !== undefined) {
      props.addHtmlRef(el, nostrEvent().id, nostrEvent().created_at);
    }
  };

  const openUserPopup = (): void => {
    setShowUserPopup(true);
  };

  const openCommentsPopup = (): void => {
    setShowCommentsPopup(true);
  };

  onMount(async () => {
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
            <EventReferences eventRefTags={eventRefTags} isLoading={isLoading} />
          </div>

          <div class='w-full grow mx-auto flex justify-around items-center rounded-md px-5 py-5 bg-slate-600 bg-opacity-40'>
            <Reactions reactions={reactions} publicKey={relay.userPubKey!} handleReaction={handleReaction} />
            <div
              class='w-1/4 p-2 rounded hover:bg-slate-600 cursor-pointer active:bg-slate-700'
              onClick={openUserPopup}
            >
              <EventAuthor
                name={nostrEvent().name}
                about={nostrEvent().about}
                picture={nostrEvent().picture}
                pubKey={nostrEvent().pubkey}
                layout='h'
              />

              <div class='text-sm text-slate-400 mt-3 text-center'>{parseDate(nostrEvent().created_at)}</div>
            </div>

            <div
              onClick={openCommentsPopup}
              class='rounded py-5 hover:bg-slate-600 cursor-pointer active:bg-slate-700 w-1/12'
            >
              <VsCommentDiscussion class='text-slate-400 mx-auto' size={28} />
            </div>

            <FiTrendingUp class='text-slate-400' size={26} />
            <EventScroller scrollPage={props.scrollPage} />
            <EventAnchor nostrEventID={nostrEvent().id} />
          </div>
        </div>

        <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 xl:w-2/3 z-10'>
          <Popup autoClose={false} show={showUserPopup} setShow={setShowUserPopup} largeHeight>
            <UserPopup
              about={nostrEvent().about}
              picture={nostrEvent().picture}
              pubkey={nostrEvent().pubkey}
              name={nostrEvent().name}
            />
          </Popup>
        </div>

        <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 xl:w-2/3 z-10'>
          <Popup autoClose={false} show={showCommentsPopup} setShow={setShowCommentsPopup} largeHeight>
            <CommmentsPopup rootEvent={nostrEvent()} />
          </Popup>
        </div>
      </Show>
    </>
  );
};

export default EventWrapper;
