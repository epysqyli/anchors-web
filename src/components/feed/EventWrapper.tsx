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

interface Props {
  event: Event;
  isNarrow: boolean | undefined;
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

  const scroll = (e: MouseEvent, direction: "up" | "down") => {
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
        <div class='snap-start h-full text-white text-lg mx-auto p-5 2xl:p-10 rounded-md'>
          <div class='flex justify-center'>
            <div class='flex w-1/4 items-center gap-x-2'>
              <div class='mr-10 text-slate-400'>
                <div
                  onClick={(e) => scroll(e, "up")}
                  class='cursor-pointer hover:bg-slate-700 group mb-10 rounded'
                >
                  <FiChevronUp size={40} class='mx-auto group-active:scale-75' />
                </div>
                <div
                  onClick={(e) => scroll(e, "down")}
                  class='cursor-pointer hover:bg-slate-700 group rounded'
                >
                  <FiChevronDown size={40} class='mx-auto group-active:scale-75' />
                </div>
              </div>

              <div ref={(el) => setRefTagsContainer(el)} class='h-[65vh] w-3/4 overflow-auto no-scrollbar'>
                <For each={eventRefTags()}>
                  {(tag) => (
                    <Motion.div animate={{ opacity: [0.2, 1], scale: [0.5, 1] }}>
                      <RefTagFeedElement tag={tag} isLoading={isLoading} />
                    </Motion.div>
                  )}
                </For>
              </div>
            </div>

            <div class='custom-scrollbar h-[70vh] overflow-auto px-20 break-words text-justify whitespace-pre-line w-3/4'>
              {nostrEvent().content}
            </div>
          </div>

          <div class='flex justify-around mt-10 border-t pt-10'>
            <div class='border p-5'>
              <div>creator</div>
              <div>info</div>
            </div>
            <div class='border p-5'>
              <div>reactions</div>
              <div>comments</div>
            </div>
            <div class='border p-5'>other actions</div>
            <div class='border p-5 flex items-center gap-x-5'>
              <div>previous</div>
              <div>next</div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default EventWrapper;
