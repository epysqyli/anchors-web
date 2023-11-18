import Reactions from "./Reactions";
import Popup from "../shared/Popup";
import UserPopup from "./UserPopup";
import EventAnchor from "./EventAnchor";
import EventAuthor from "./EventAuthor";
import EventContent from "./EventContent";
import RepostAction from "./RepostAction";
import EventScroller from "./EventScroller";
import CommmentsPopup from "./CommentsPopup";
import { FiTrendingUp } from "solid-icons/fi";
import CommentsActions from "./CommentsAction";
import { RelayContext } from "~/contexts/relay";
import EventReferences from "./EventReferences";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import FavoriteEventAction from "./FavoriteEventAction";
import menuTogglerContext from "~/contexts/menuToggle";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { fetchMovie } from "~/lib/external-services/tmdb";
import { fetchSong } from "~/lib/external-services/spotify";
import { parseReferenceType } from "~/lib/ref-tags/references";
import { fetchBook } from "~/lib/external-services/open-library";
import { parseDate, shrinkContent } from "~/lib/nostr/nostr-utils";
import EventComments, { CommentTree } from "~/lib/nostr/event-comments";
import { Accessor, Component, Show, createContext, createSignal, onMount, useContext } from "solid-js";

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
  const menuToggler = useContext(menuTogglerContext);
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
    menuToggler.toggleMenuButton();
    setShowUserPopup(true);
  };

  const openCommentsPopup = (): void => {
    menuToggler.toggleMenuButton();
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
        <div ref={handleEventHtmlRef} class='snap-start h-[90dvh] text-white pt-2 mx-auto px-2'>
          <div
            class={`${
              eventRefTags().length ? "h-3/5" : "h-4/5"
            }  text-neutral-300 mx-auto p-2 pr-5 overflow-auto 
               tracking-tight break-words bg-slate-800 bg-opacity-40 rounded`}
          >
            {props.event.content}
          </div>

          <div
            class={`${
              eventRefTags().length ? "h-1/5" : "hidden"
            } flex snap-x snap-mandatory overflow-x-scroll`}
          >
            <EventReferences eventRefTags={eventRefTags} isLoading={isLoading} />
          </div>

          <div class='h-[10%] flex items-center justify-around'>
            <div onClick={openUserPopup}>
              <EventAuthor
                name={shrinkContent(props.event.name, 15)}
                about={props.event.about}
                picture={props.event.picture}
                pubKey={props.event.pubkey}
                layout='h'
              />
            </div>

            <Reactions event={props.event} />

            <CommentsActions
              commentsCount={commentsCount}
              isLoading={isLoading}
              openCommentsPopup={openCommentsPopup}
            />

            {authMode.get() == "private" ? <FavoriteEventAction eventID={props.event.id} /> : <></>}
          </div>

          <div class='h-[10%] flex items-center justify-around gap-x-3'>
            <div class='text-sm text-slate-400 w-1/3 text-center'>
              <p>{new Date(props.event.created_at).toTimeString().split(" ")[0]}</p>
              <p>{new Date(props.event.created_at).toDateString()}</p>
            </div>
            <EventAnchor nostrEventID={props.event.id} />
            {authMode.get() == "private" ? <RepostAction enrichedEvent={props.event} /> : <></>}
          </div>
        </div>
        <div class='h-[10dvh]'></div>

        <div class='absolute top-0 left-0 z-10'>
          <Popup autoClose={false} show={showUserPopup} setShow={setShowUserPopup} largeHeight>
            <UserPopup
              about={props.event.about}
              picture={props.event.picture}
              pubkey={props.event.pubkey}
              name={props.event.name}
            />
          </Popup>
        </div>

        <div class='absolute top-0 left-0 z-10'>
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

            <CommentsActions
              commentsCount={commentsCount}
              isLoading={isLoading}
              openCommentsPopup={openCommentsPopup}
            />

            {authMode.get() == "private" ? <FavoriteEventAction eventID={props.event.id} /> : <></>}
            {authMode.get() == "private" ? <RepostAction enrichedEvent={props.event} /> : <></>}
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
