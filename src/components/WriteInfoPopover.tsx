import { Component, Show } from "solid-js";
import { Motion, Presence } from "@motionone/solid";
import { AiOutlineCheckCircle } from "solid-icons/ai";

const WriteInfoPopover: Component<{
  togglePopover(): void;
  showPopover: boolean;
}> = (props) => {
  return (
    <Presence>
      <Show when={props.showPopover}>
        <Motion.div
          exit={{ opacity: [1, 0.1], transition: { duration: 0.3 } }}
          class="w-11/12 md:w-1/2 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 absolute"
        >
          <Motion.div
            animate={{ scale: [0.5, 1.05, 1] }}
            transition={{ duration: 0.2, easing: "ease-in" }}
            class="bg-gradient-to-br from-gray-950 to-slate-800 py-6 px-8 rounded-sm border border-slate-600"
          >
            <p class="text-slate-200 text-justify">
              The goal of Anchors (this nostr client) is not that of replicating
              usual social network dynamics: we strive towards providing a much
              needed clarifying context to ideas in order to connect them
              together, unlock new insights, and cement them in our imagination.
            </p>

            <p class="text-slate-200 text-justify mt-5">
              This is why every post should reference at least an external
              resource, such as a youtube video, a book, a blog post, etc etc ...
              or another idea found on Anchors.
            </p>

            <button
              onClick={props.togglePopover}
              class="block text-slate-200 mx-auto mt-10 hover:text-orange-200 active:scale-95 transition-all"
            >
              <AiOutlineCheckCircle size={40} />
            </button>
          </Motion.div>
        </Motion.div>
      </Show>
    </Presence>
  );
};

export default WriteInfoPopover;
