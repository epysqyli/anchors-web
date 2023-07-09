import { Event } from "nostr-tools";
import { Component, For, Show, createSignal, onMount } from "solid-js";
import { BiRegularBoltCircle } from "solid-icons/bi";
import RefTagFeedElement from "./RefTagFeedElement";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";
import { parseReferenceType } from "~/lib/ref-tags/references";
import { fetchMovie } from "~/lib/external-services/tmdb";
import { fetchBook } from "~/lib/external-services/open-library";
import { fetchSong } from "~/lib/external-services/spotify";
import { Motion } from "@motionone/solid";
import { FiChevronDown, FiChevronUp } from "solid-icons/fi";
import { IoArrowDown, IoArrowUp } from "solid-icons/io";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import EventAuthor from "./EventAuthor";

interface Props {
  event: IEnrichedEvent;
  isNarrow: boolean | undefined;
  scrollPage?(direction: "up" | "down"): void;
  assignTopEventRef(ref: HTMLDivElement, eventID: string): void;
}

const EventWrapper: Component<Props> = (props) => {
  const nostrEvent = () => props.event;
  const [eventRefTags, setEventRefTags] = createSignal<IFeedRefTag[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(true);
  const [refTagsContainer, setRefTagsContainer] = createSignal<HTMLDivElement>();

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

  const scrollRefTags = (e: MouseEvent, direction: "up" | "down") => {
    refTagsContainer()!.scrollBy({
      top: direction == "up" ? -400 : 400,
      behavior: "smooth"
    });
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
          ref={(el) => props.assignTopEventRef(el, props.event.id)}
          class='snap-start h-full text-white text-lg mx-auto p-5 2xl:px-20 2xl:py-10 rounded-md'
        >
          <div class='flex justify-around py-2'>
            <div
              class='py-5 bg-gray-800 custom-scrollbar text-slate-200 tracking-tighter px-10 h-[70vh] 
                     overflow-auto break-words text-justify whitespace-pre-line w-3/5 border-y border-slate-600'
            >
              {nostrEvent().content}
            </div>

            <div class='w-1/5 h-[69vh]'>
              <div
                onClick={(e) => scrollRefTags(e, "up")}
                class='text-slate-500 hover:text-slate-200 hover:scale-110 group cursor-pointer'
              >
                <FiChevronUp size={40} class='mx-auto group-active:scale-75' />
              </div>

              <div ref={(el) => setRefTagsContainer(el)} class='h-5/6 overflow-auto no-scrollbar my-5'>
                <For each={eventRefTags()}>
                  {(tag) => (
                    <Motion.div animate={{ opacity: [0.2, 1], scale: [0.5, 1] }}>
                      <RefTagFeedElement tag={tag} isLoading={isLoading} />
                    </Motion.div>
                  )}
                </For>
              </div>

              <div
                onClick={(e) => scrollRefTags(e, "down")}
                class='text-slate-500 hover:text-slate-200 hover:scale-110 group cursor-pointer'
              >
                <FiChevronDown size={40} class='mx-auto group-active:scale-75' />
              </div>
            </div>
          </div>

          <div class='flex justify-around mt-16 rounded w-5/6 mx-auto py-5 bg-neutral-900 bg-opacity-30'>
            <EventAuthor
              name={nostrEvent().name}
              about={nostrEvent().about}
              picture={nostrEvent().picture}
              pubKey={nostrEvent().pubkey}
            />

            <div class='p-2 flex items-center gap-x-1 text-slate-400'>
              <div
                onClick={() => props.scrollPage!("up")}
                class='cursor-pointer hover:scale-105 hover:text-slate-200 active:scale-90'
              >
                <IoArrowUp size={40} />
              </div>
              <div
                onClick={() => props.scrollPage!("down")}
                class='cursor-pointer hover:scale-105 hover:text-slate-200 active:scale-90'
              >
                <IoArrowDown size={40} />
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default EventWrapper;
