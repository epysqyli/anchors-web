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
import { useIsNarrow } from "~/hooks/useMediaQuery";
import { VsCommentDiscussion } from "solid-icons/vs";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { fetchMovie } from "~/lib/external-services/tmdb";
import { fetchSong } from "~/lib/external-services/spotify";
import { parseReferenceType } from "~/lib/ref-tags/references";
import { fetchBook } from "~/lib/external-services/open-library";
import { parseDate, shrinkContent } from "~/lib/nostr/nostr-utils";
import EventComments, { CommentTree } from "~/lib/nostr/event-comments";
import { Accessor, Component, For, Show, createContext, createSignal, onMount, useContext } from "solid-js";

interface Props {
  event: IEnrichedEvent;
  scrollPage?(direction: "up" | "down"): void;
  addHtmlRef?(ref: HTMLDivElement, eventID: string, createdAt: number): void;
}

export const CommentsContext = createContext<{
  rootEvent: IEnrichedEvent;
  fetchAndSetCommentsStructure(arbitraryDelay: boolean): Promise<void>;
  isCommentTreeLoading: Accessor<boolean>;
}>();

const EventWrapper: Component<Props> = (props) => {
  const { relay, authMode } = useContext(RelayContext);

  const [isLoading, setIsLoading] = createSignal<boolean>(true);
  const [eventRefTags, setEventRefTags] = createSignal<IFeedRefTag[]>([]);
  const [showUserPopup, setShowUserPopup] = createSignal<boolean>(false);
  const [commentsStructure, setCommentsStructure] = createSignal<CommentTree>();
  const [commentsCount, setCommentsCount] = createSignal<number>(0);
  const [showCommentsPopup, setShowCommentsPopup] = createSignal<boolean>(false);
  const [isCommentTreeLoading, setIsCommentTreeLoading] = createSignal<boolean>(false);

  const handleEventHtmlRef = (el: HTMLDivElement): void => {
    if (props.addHtmlRef !== undefined) {
      props.addHtmlRef(el, props.event.id, props.event.created_at);
    }
  };

  const openUserPopup = (): void => {
    setShowUserPopup(true);
  };

  const openCommentsPopup = (): void => {
    setShowCommentsPopup(true);
  };

  const fetchAndSetCommentsStructure = async (arbitraryDelay: boolean): Promise<void> => {
    setIsCommentTreeLoading(true);

    if (arbitraryDelay) {
      await new Promise((res) => setTimeout(res, 500));
    }

    const comments = await relay.fetchComments(props.event.id);
    setCommentsCount(comments.length);
    setCommentsStructure(new EventComments(props.event, comments).structure);
    setIsCommentTreeLoading(false);
  };

  onMount(async () => {
    const referenceTags = props.event.tags
      .filter((t) => t[0] == "r")
      .filter((t) => t[1] != relay.ANCHORS_EVENT_RTAG_IDENTIFIER);

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

    await fetchAndSetCommentsStructure(false);

    setIsLoading(false);
  });

  return (
    <>
      <Show when={useIsNarrow() !== undefined && useIsNarrow()}>
        <div class='snap-start h-[90dvh] text-white pt-4 mx-auto px-2'>
          <div class='h-3/5 mx-auto py-2 pr-5 overflow-auto break-words'>{props.event.content}</div>

          <div class='h-1/5 flex snap-x snap-mandatory overflow-x-scroll'>
            <EventReferences eventRefTags={eventRefTags} isLoading={isLoading} />
          </div>

          <div class='border h-[10%]'>user - reactions - comments</div>

          <div class='border h-[10%]'>created_at - link to event - repost</div>
        </div>
        <div class='h-[10dvh]'></div>
      </Show>

      <Show when={useIsNarrow() !== undefined && !useIsNarrow()}>
        <div
          ref={handleEventHtmlRef}
          class='snap-start h-full text-white text-lg mx-auto rounded-md px-3 py-1 gap-y-3'
        >
          <div class='grid grid-cols-6 h-[84%] mb-2 gap-x-2'>
            <EventContent content={props.event.content} />
            <EventReferences eventRefTags={eventRefTags} isLoading={isLoading} />
          </div>

          <div class='w-full grow mx-auto flex justify-around items-center rounded-md px-5 h-[15%] bg-neutral-700 bg-opacity-25'>
            <EventScroller scrollPage={props.scrollPage} />

            <div
              class='w-1/4 p-2 rounded hover:bg-slate-600 cursor-pointer active:bg-slate-700'
              onClick={openUserPopup}
            >
              <EventAuthor
                name={shrinkContent(props.event.name, 10)}
                about={props.event.about}
                picture={props.event.picture}
                pubKey={props.event.pubkey}
                layout='h'
              />

              <div class='text-sm text-slate-400 mt-3 text-center'>{parseDate(props.event.created_at)}</div>
            </div>

            <Reactions event={props.event!} />

            <Show
              when={!isLoading()}
              fallback={
                <div class='relative rounded py-5 w-1/12 animate-pulse'>
                  <VsCommentDiscussion class='text-slate-500 mx-auto' size={28} />
                </div>
              }
            >
              <div
                onClick={openCommentsPopup}
                class='relative rounded py-5 hover:bg-slate-600 cursor-pointer active:bg-slate-700 w-1/12'
              >
                <VsCommentDiscussion class='text-slate-400 mx-auto' size={28} />
                <div class='absolute top-1 right-4 text-sm text-slate-400 tracking-tighter'>
                  {commentsCount()}
                </div>
              </div>
            </Show>

            {authMode.get() == "private" ? <FiTrendingUp class='text-slate-400' size={26} /> : <></>}
            <EventAnchor nostrEventID={props.event.id} />
          </div>
        </div>

        <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 xl:w-2/3 z-10'>
          <Popup autoClose={false} show={showUserPopup} setShow={setShowUserPopup} largeHeight>
            <UserPopup
              about={props.event.about}
              picture={props.event.picture}
              pubkey={props.event.pubkey}
              name={props.event.name}
            />
          </Popup>
        </div>

        <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 xl:w-2/3 z-10'>
          <Popup autoClose={false} show={showCommentsPopup} setShow={setShowCommentsPopup} largeHeight>
            <CommentsContext.Provider
              value={{
                rootEvent: props.event,
                fetchAndSetCommentsStructure: fetchAndSetCommentsStructure,
                isCommentTreeLoading: isCommentTreeLoading
              }}
            >
              <CommmentsPopup commentsStructure={commentsStructure()} />
            </CommentsContext.Provider>
          </Popup>
        </div>
      </Show>
    </>
  );
};

export default EventWrapper;
