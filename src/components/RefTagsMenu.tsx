import IRefTag from "~/interfaces/IRefTag";
import RefTagElement from "./RefTagElement";
import { IoCloseCircle } from "solid-icons/io";
import OverlayContext from "~/contexts/overlay";
import { Motion, Presence } from "@motionone/solid";
import RefTagsSearchPanel from "./RefTagsSearchPanel";
import { Component, For, Show, useContext } from "solid-js";

interface Props {
  showRefMenu: boolean;
  toggleRefMenu(): void;
  tags: IRefTag[];
  addNostrTag(nostrTag: IRefTag): void;
  removeTag(tag: IRefTag): void;
}

// snap-x scrollable on mobile, side by side on wide view
const RefTagsMenu: Component<Props> = (props) => {
  const tags = () => props.tags;
  const showRefMenu = () => props.showRefMenu;
  const toggleRefMenu = () => props.toggleRefMenu();

  const overlay = useContext(OverlayContext);

  return (
    <Presence>
      <Show when={showRefMenu()}>
        <Motion.div
          initial={{ top: 0, left: 0, position: "absolute" }}
          animate={{
            scale: [0.3, 1.05, 1],
            left: ["50%", "50%", "50%"],
            x: ["-50%", "-50%", "-50%"],
            zIndex: 1,
          }}
          transition={{ duration: 0.4, easing: "ease-out" }}
          exit={{
            opacity: [1, 0.9, 0.1],
            scale: [1, 1.1, 0.3],
            zIndex: 0,
            transition: { duration: 0.2, easing: "ease-in" },
          }}
          onMotionStart={overlay.toggleOverlay}
          class="h-[80%] w-[80%] bg-slate-700 rounded-md text-slate-200"
        >
          <div class="relative flex h-full py-3">
            <div class="w-1/2 py-2 overflow-y-auto custom-scrollbar">
              <For each={tags()}>
                {(tag) => (
                  <Motion.div
                    animate={{ scale: [0.5, 1] }}
                    class="mb-3 w-11/12 mx-auto"
                  >
                    <RefTagElement tag={tag} removeTag={props.removeTag} />
                  </Motion.div>
                )}
              </For>
            </div>

            <div class="w-1/2 py-2 border-l-2 border-slate-400">
              <RefTagsSearchPanel addNostrTag={props.addNostrTag} />
            </div>
          </div>

          <button
            class="absolute -top-3 -right-3 cursor-pointer transition hover:scale-95"
            onClick={toggleRefMenu}
          >
            <IoCloseCircle size={30} />
          </button>
        </Motion.div>
      </Show>
    </Presence>
  );
};

export default RefTagsMenu;
