import { Event } from "nostr-tools";
import ReferenceTag from "./ReferenceTag";
import { Component, For, Show } from "solid-js";
import { BiRegularBoltCircle } from "solid-icons/bi";

interface Props {
  isNarrow: boolean | undefined;
  event: Event;
}

const EventWrapper: Component<Props> = (props) => {
  const nostrEvent = () => props.event;
  const referenceTags = nostrEvent().tags.filter((t) => t[0] == "r");

  return (
    <>
      <Show when={props.isNarrow !== undefined && props.isNarrow}>
        <div class="snap-start h-[100vh] text-white pt-4 mx-auto">
          <div class="h-[60vh] w-11/12 mx-auto py-2 pr-5 mb-10 text-justify overflow-auto break-words shadow-inner">
            {nostrEvent().content}
          </div>
          <div class="mb-10 w-11/12 mx-auto pb-5 snap-x snap-mandatory overflow-scroll flex justify-start gap-x-10">
            <For each={nostrEvent().tags}>
              {(tag) => (
                <div class="snap-center w-4/5 px-5 py-1 flex items-center bg-slate-300 rounded">
                  <div class="w-1/4">
                    <BiRegularBoltCircle size={40} color="#334155" />
                  </div>
                  <div class="break-words w-3/4 px-2 text-sm text-slate-700">
                    {tag[1]}
                  </div>
                </div>
              )}
            </For>
          </div>

          <div class="flex items-center justify-between w-4/5 mx-auto">
            <div class="border-b pb-2">comments</div>
            <div class="border-b pb-2">reactions</div>
          </div>
        </div>
      </Show>

      <Show when={props.isNarrow !== undefined && !props.isNarrow}>
        <div class="snap-start h-full text-white text-lg px-10 pt-10 mx-auto w-4/5 md:w-11/12 2xl:p-16 rounded-md">
          <div class="flex justify-center gap-x-5">
            <div class="w-1/4">
              <For each={referenceTags}>
                {(tag) => <ReferenceTag tag={tag} />}
              </For>
            </div>

            <div
              class="custom-scrollbar h-[70vh] overflow-auto pr-10 break-words text-justify
                        whitespace-pre-line w-3/4"
            >
              {nostrEvent().content}
            </div>
          </div>

          <div class="flex justify-around mt-10 pt-5 gap-x-10">
            <div
              class="text-slate-300 text-center text-md py-3 border-opacity-50
                        border-slate-500 border-b w-1/3"
            >
              like
            </div>
            <div
              class="text-slate-300 text-center text-md py-3 border-opacity-50
                        border-slate-500 border-b w-1/3"
            >
              dislike
            </div>
            <div
              class="text-slate-300 text-center text-md py-3 border-opacity-50
                        border-slate-500 border-b w-1/3"
            >
              comments
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default EventWrapper;