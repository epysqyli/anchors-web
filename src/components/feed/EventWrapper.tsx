import { A } from "@solidjs/router";
import EventAuthor from "./EventAuthor";
import { useLocation } from "solid-start";
import { Motion } from "@motionone/solid";
import { FiTrendingUp } from "solid-icons/fi";
import { RelayContext } from "~/contexts/relay";
import { Reaction } from "~/interfaces/IReaction";
import { parseDate } from "~/lib/nostr/nostr-utils";
import RefTagFeedElement from "./RefTagFeedElement";
import { VsCommentDiscussion } from "solid-icons/vs";
import { BiRegularBoltCircle } from "solid-icons/bi";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { fetchMovie } from "~/lib/external-services/tmdb";
import { fetchSong } from "~/lib/external-services/spotify";
import { reactToEvent } from "~/lib/nostr/nostr-nips-actions";
import { parseReferenceType } from "~/lib/ref-tags/references";
import { fetchBook } from "~/lib/external-services/open-library";
import { Component, For, Show, createSignal, onMount, useContext } from "solid-js";
import { FiChevronDown, FiChevronUp, FiThumbsDown, FiThumbsUp } from "solid-icons/fi";

interface Props {
  event: IEnrichedEvent;
  isNarrow: boolean | undefined;
  scrollPage?(direction: "up" | "down"): void;
  assignTopEventRef?(ref: HTMLDivElement, eventID: string): void;
}

const EventWrapper: Component<Props> = (props) => {
  const relay = useContext(RelayContext);

  const nostrEvent = () => props.event;
  const [eventRefTags, setEventRefTags] = createSignal<IFeedRefTag[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(true);

  const handleTopEventRef = (el: HTMLDivElement, eventID: string): void => {
    if (props.assignTopEventRef !== undefined) {
      props.assignTopEventRef(el, eventID);
    }
  };

  const handleReaction = async (reaction: Reaction): Promise<void> => {
    await reactToEvent(relay, nostrEvent().id, nostrEvent().pubkey, reaction);
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

  const anchorNostrIDstyle = (): string => {
    if (useLocation().pathname.includes(nostrEvent().id)) {
      return "text-sm break-all w-1/5 text-slate-400 bg-slate-600 px-2 py-1 rounded cursor-default";
    }

    return `text-sm break-all w-1/5 text-slate-400 cursor-pointer bg-slate-600
            px-2 py-1 rounded hover:text-slate-200 active:scale-95 transition-all`;
  };

  return (
    <>
      <Show when={props.isNarrow !== undefined && props.isNarrow}>
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

      <Show when={props.isNarrow !== undefined && !props.isNarrow}>
        <div
          ref={(el) => handleTopEventRef(el, props.event.id)}
          class='snap-start h-full text-white text-lg mx-auto rounded-md px-3 py-1 gap-y-3 flex flex-col justify-between'
        >
          <div class='grid grid-cols-5 h-[85%] gap-x-3 2xl:gap-x-5'>
            <div
              class='col-span-4 xl:col-span-3 bg-slate-700 custom-scrollbar
                     text-slate-300 tracking-tighter overflow-auto break-words text-justify
                      whitespace-pre-line rounded-md py-20'
            >
              <p class='w-3/5 mx-auto'>{nostrEvent().content}</p>
            </div>

            <div class='col-span-1 xl:col-span-2 h-full overflow-auto no-scrollbar rounded-md bg-slate-800'>
              <div class='text-center text-base text-slate-200 bg-slate-600 w-4/5 xl:w-3/5 mx-auto mt-5 py-2 rounded-md'>
                {eventRefTags().length == 1 ? "1 reference" : `${eventRefTags().length} references`}
              </div>

              <div class='h-[90%] overflow-auto no-scrollbar py-5 px-2 xl:px-24 mx-auto'>
                <For each={eventRefTags()}>
                  {(tag) => (
                    <Motion.div animate={{ opacity: [0.2, 1], scale: [0.5, 1] }}>
                      <RefTagFeedElement tag={tag} isLoading={isLoading} />
                    </Motion.div>
                  )}
                </For>
              </div>
            </div>
          </div>

          <div class='w-full grow mx-auto flex justify-around items-center rounded-md py-5 bg-slate-600 bg-opacity-80'>
            <div>
              <EventAuthor
                name={nostrEvent().name}
                about={nostrEvent().about}
                picture={nostrEvent().picture}
                pubKey={nostrEvent().pubkey}
              />

              <div class='text-center text-sm text-slate-400 mt-3'>{parseDate(nostrEvent().created_at)}</div>
            </div>

            <A class={anchorNostrIDstyle()} href={`/events/${nostrEvent().id}`}>
              {nostrEvent().id}
            </A>

            <div class='flex items-center gap-x-2 text-slate-400'>
              <div
                onClick={() => handleReaction("+")}
                class='cursor-pointer hover:text-slate-200 hover:scale-105 active:scale-95 transition-all'
              >
                <FiThumbsUp size={26} />
                <p class='text-center text-sm mt-1'>{nostrEvent().positive}</p>
              </div>
              <div
                onClick={() => handleReaction("-")}
                class='cursor-pointer hover:text-slate-200 hover:scale-105 active:scale-95 transition-all'
              >
                <FiThumbsDown size={26} />
                <p class='text-center text-sm mt-1'>{nostrEvent().negative}</p>
              </div>
            </div>

            <div>
              <FiTrendingUp class='text-slate-400' size={26} />
            </div>

            <div>
              <VsCommentDiscussion class='text-slate-400' size={28} />
            </div>

            {props.scrollPage !== undefined ? (
              <div class='p-2 flex items-center gap-x-1 text-slate-400'>
                <div
                  onClick={() => props.scrollPage!("up")}
                  class='cursor-pointer hover:scale-105 hover:text-slate-200 active:scale-90'
                >
                  <FiChevronUp size={40} />
                </div>
                <div
                  onClick={() => props.scrollPage!("down")}
                  class='cursor-pointer hover:scale-105 hover:text-slate-200 active:scale-90'
                >
                  <FiChevronDown size={40} />
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Show>
    </>
  );
};

export default EventWrapper;
