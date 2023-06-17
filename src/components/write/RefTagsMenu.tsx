import RefTagElement from "./RefTagElement";
import OverlayContext from "~/contexts/overlay";
import { Motion, Presence } from "@motionone/solid";
import RefTagsSearchPanel from "./RefTagsSearchPanel";
import { RiSystemCloseCircleFill } from "solid-icons/ri";
import { Component, For, Show, useContext } from "solid-js";
import { IRefTag } from "~/interfaces/IRefTag";

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
  const toggleRefMenu = () => props.toggleRefMenu();

  const overlay = useContext(OverlayContext);

  return (
    <>
      <div>
        <RefTagsSearchPanel addNostrTag={props.addNostrTag} />
      </div>
      {/* <div>
        <div class='w-1/2 py-2 overflow-y-auto custom-scrollbar'>
          <For each={tags()}>
            {(tag) => (
              <Motion.div animate={{ scale: [0.5, 1] }} class='mb-3 w-11/12 mx-auto'>
                <RefTagElement tag={tag} removeTag={props.removeTag} />
              </Motion.div>
            )}
          </For>
        </div>
      </div> */}
    </>
  );
};

export default RefTagsMenu;
