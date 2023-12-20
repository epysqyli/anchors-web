import { Motion } from "@motionone/solid";
import RefTagFeedElement from "./RefTagFeedElement";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";
import { Accessor, Component, For, JSX, Show } from "solid-js";

interface Props {
  isLoading: Accessor<boolean>;
  eventRefTags: Accessor<IFeedRefTag[]>;
}

const EventReferences: Component<Props> = (props): JSX.Element => {
  return (
    <>
      <Show when={useIsNarrow() !== undefined && useIsNarrow()}>
        <For each={props.eventRefTags()}>
          {(tag) => (
            <Motion.div animate={{ opacity: [0.2, 1], scale: [0.5, 1] }} class='snap-center py-2'>
              <RefTagFeedElement tag={tag} isLoading={props.isLoading} />
            </Motion.div>
          )}
        </For>
      </Show>

      <Show when={useIsNarrow() !== undefined && !useIsNarrow()}>
        <></>
        <div class='col-span-1 md:col-span-2 h-full overflow-auto no-scrollbar rounded-md bg-neutral-900 bg-opacity-40'>
          <div class='text-center text-base text-slate-200 bg-slate-700 w-fit px-10 mx-auto my-5 py-2 rounded-md'>
            {props.eventRefTags().length == 1 ? "1 reference" : `${props.eventRefTags().length} references`}
          </div>

          <div class='h-[90%] overflow-auto no-scrollbar py-5 px-2 md:px-12 mx-auto'>
            <For each={props.eventRefTags()}>
              {(tag) => (
                <Motion.div animate={{ opacity: [0.2, 1], scale: [0.5, 1] }}>
                  <RefTagFeedElement tag={tag} isLoading={props.isLoading} />
                </Motion.div>
              )}
            </For>
          </div>
        </div>
      </Show>
    </>
  );
};

export default EventReferences;
