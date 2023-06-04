import { Event } from "nostr-tools";
import ReferenceTag from "./ReferenceTag";
import { Component, For, Show } from "solid-js";

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
        <></>
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
        </div>
      </Show>
    </>
  );
};

export default EventWrapper;
