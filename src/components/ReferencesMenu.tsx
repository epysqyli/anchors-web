import { Motion, Presence } from "@motionone/solid";
import { Rerun } from "@solid-primitives/keyed";
import { IoCloseCircle } from "solid-icons/io";
import { Component, For, Show, useContext } from "solid-js";
import OverlayContext from "~/contexts/overlay";

interface Props {
  showRefMenu: boolean;
  toggleRefMenu(): void;
  tags: string[][];
}

// provides two submenus to manage and add new refs to the event
// popups clicking VsReferences on write page
// submenus are snap-x scrollable on mobile
// side by side on wide layout with search on the right
const ReferencesMenu: Component<Props> = (props) => {
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
            scale: [0.3, 1],
            left: "50%",
            x: "-50%",
            zIndex: 1,
          }}
          transition={{ duration: 0.2, easing: "ease-out" }}
          exit={{
            opacity: [1, 0.1],
            zIndex: 0,
            transition: { duration: 0.3, easing: "ease-out" },
          }}
          onMotionComplete={overlay.toggleOverlay}
          class="h-[80%] w-[80%] bg-slate-700 rounded-md text-slate-200"
        >
          <div class="relative flex h-full">
            <div class="w-1/2 py-5">
              <For each={tags()}>
                {(tag) => (
                  <div class="break-words mb-5 w-5/6 mx-auto border-b pb-3 px-2">
                    {tag[1]}
                  </div>
                )}
              </For>
            </div>

            <div class="w-1/2 py-5 border-l">
              <div class="mx-auto w-1/2 py-3 border text-center mb-5 rounded">
                search box
              </div>
              <div class="mx-auto w-1/2 my-4 text-center">
                actionable reference
              </div>
              <div class="mx-auto w-1/2 my-4 text-center">
                actionable reference
              </div>
              <div class="mx-auto w-1/2 my-4 text-center">
                actionable reference
              </div>
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

export default ReferencesMenu;
