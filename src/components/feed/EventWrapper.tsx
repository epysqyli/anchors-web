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
import { parseDate, shrinkContent } from "~/lib/nostr/nostr-utils";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import { VsCommentDiscussion } from "solid-icons/vs";
import { BiRegularBoltCircle } from "solid-icons/bi";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { fetchMovie } from "~/lib/external-services/tmdb";
import { fetchSong } from "~/lib/external-services/spotify";
import { parseReferenceType } from "~/lib/ref-tags/references";
import { fetchBook } from "~/lib/external-services/open-library";
import EventComments, { CommentTree } from "~/lib/nostr/event-comments";
import { Accessor, Component, For, Show, createContext, createSignal, onMount, useContext } from "solid-js";

interface Props {
  event: IEnrichedEvent;
  scrollPage?(direction: "up" | "down"): void;
  addHtmlRef?(ref: HTMLDivElement, eventID: string, createdAt: number): void;
}

export const CommentsContext = createContext<{
  rootEvent: IEnrichedEvent;
  fetchAndSetCommentsStructure(): Promise<void>;
  isCommentTreeLoading: Accessor<boolean>;
}>();

const EventWrapper: Component<Props> = (props) => {
  const { relay } = useContext(RelayContext);

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

  const fetchAndSetCommentsStructure = async (): Promise<void> => {
    setIsCommentTreeLoading(true);
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

    await fetchAndSetCommentsStructure();

    setIsLoading(false);
  });

  return (
    <>
      <Show when={useIsNarrow() !== undefined && useIsNarrow()}>
        <div class='snap-start h-[100vh] text-white pt-4 mx-auto'>
          <div class='h-[60vh] w-11/12 mx-auto py-2 pr-5 mb-10 text-justify overflow-auto break-words shadow-inner'>
            {props.event.content}
          </div>
          <div class='mb-10 w-11/12 mx-auto pb-5 snap-x snap-mandatory overflow-scroll flex justify-start gap-x-10'>
            <For each={props.event.tags}>
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
          class='snap-start h-full text-white text-lg mx-auto rounded-md px-3 py-1 gap-y-3'
        >
          <div class='grid grid-cols-6 h-[85%] gap-x-2'>
            <EventContent content={props.event.content} />
            <EventReferences eventRefTags={eventRefTags} isLoading={isLoading} />
          </div>

          <div
            class='w-full grow mx-auto flex justify-around items-center
                   rounded-md px-5 py-4 mt-3 bg-neutral-700 bg-opacity-25'
          >
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

            <FiTrendingUp class='text-slate-400' size={26} />
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
