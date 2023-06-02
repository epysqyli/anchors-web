import { Event } from "nostr-tools";
import { Component, For, Show } from "solid-js";

interface Props {
  isNarrow: boolean | undefined;
  events: Event[];
}

const EventWrapper: Component<Props> = (props) => {
  return (
    <>
      <Show when={props.isNarrow !== undefined && props.isNarrow}>
        <div class="snap-y snap-mandatory overflow-scroll overflow-x-hidden h-[100vh]">
          <For each={props.events}>
            {(nostrEvent) => (
              <div class="snap-start h-[100vh] text-white pt-10 mx-auto w-11/12">
                <div class="h-[70vh] px-10 text-justify overflow-auto">
                  {nostrEvent.content}
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      <Show when={props.isNarrow !== undefined && !props.isNarrow}>
          <div class="custom-scrollbar snap-y snap-mandatory overflow-scroll overflow-x-hidden h-full">
            <For each={props.events}>
              {(nostrEvent) => (
                <div
                  class="snap-start h-full text-white text-xl px-10 pt-10 mx-auto w-4/5 2xl:w-3/5 2xl:p-16 rounded-md"
                >
                  <div class="custom-scrollbar h-[70vh] overflow-auto pr-10 text-justify">
                    {nostrEvent.content}
                  </div>
                </div>
              )}
            </For>
          </div>
      </Show>
    </>
  );
};

export default EventWrapper;
