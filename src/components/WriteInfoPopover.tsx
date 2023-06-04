import { Component, Show } from "solid-js";
import { Motion, Presence } from "@motionone/solid";
import { AiOutlineCheckCircle } from "solid-icons/ai";

const WriteInfoPopover: Component<{ togglePopover(): void, showPopover: boolean }> = (props) => {
  return (
    <Presence>
    <Show when={props.showPopover}>
      <Motion.div
        exit={{ opacity: [1, 0.1], transition: { duration: 0.3 } }}
        class="w-3/4 md:w-1/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 absolute"
      >
        <Motion.div
          animate={{ scale: [0.5, 1.05, 1] }}
          transition={{ duration: 0.3, easing: "ease-out" }}
          class="bg-slate-800 py-6 px-8 rounded-md border border-orange-200"
        >
          <p class="text-slate-200 text-justify">
            The goal of Anchors (this nostr client) is not that of replicating the
            blue bird: we strive towards providing a much needed clarifying
            context to ideas in order to connect them together, unlock new
            insights, and cement them in our imagination.
          </p>

          <button
            onClick={props.togglePopover}
            class="block text-slate-200 mx-auto mt-10"
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
