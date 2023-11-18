import { Accessor, Component, JSX, Show } from "solid-js";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { IUserMetadata } from "~/interfaces/IUserMetadata";

interface Props {
  event: IEnrichedEvent;
  reposter: Accessor<IUserMetadata | null | undefined>;
  refTagsLength: number;
}

const EventContent: Component<Props> = (props): JSX.Element => {
  return (
    <>
      <Show when={useIsNarrow() != undefined && useIsNarrow()}>
        <div
          class={`${
            props.refTagsLength ? "h-3/5" : "h-4/5"
          } text-neutral-300 mx-auto overflow-auto tracking-tight break-words rounded`}
        >
          <Show when={props.event.isRepost}>
            <div class='h-full w-full'>
              <div class='h-[8%] mb-[2%] mx-auto py-2 bg-orange-500 bg-opacity-30 w-full text-sm text-center rounded-md'>
                repost by {props.reposter()?.name ?? "npub"}
              </div>
              <div class='h-[90%] pr-5 py-3 pl-2 bg-slate-800 bg-opacity-40 rounded-md  overflow-y-scroll'>
                {props.event.content}
              </div>
            </div>
          </Show>

          <Show when={!props.event.isRepost}>
            <div class='pr-5 py-3 pl-2 bg-slate-800 bg-opacity-40 rounded-md h-full'>
              {props.event.content}
            </div>
          </Show>
        </div>
      </Show>

      <Show when={useIsNarrow() != undefined && !useIsNarrow()}>
        <Show when={props.event.isRepost}>
          <div class='col-span-4 xl:col-span-4 h-full overflow-y-hidden'>
            <div class='h-[9%] relative bg-slate-500 bg-opacity-30 rounded-md mb-[1%]'>
              <div
                class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              text-base text-slate-300 w-full text-center'
              >
                repost by {props.reposter()?.name ?? "npub"}
              </div>
            </div>

            <div
              class='w-full bg-neutral-900 bg-opacity-30 rounded-md mx-auto text-slate-300
                   tracking-tighter py-10 break-words whitespace-pre-line h-[90%]'
            >
              <p class='w-5/6 px-5 mx-auto overflow-y-scroll xl:custom-scrollbar h-full'>
                {props.event.content}
              </p>
            </div>
          </div>
        </Show>

        <Show when={!props.event.isRepost}>
          <div class='col-span-4 xl:col-span-4 bg-neutral-900 bg-opacity-30 rounded-md h-full overflow-y-hidden py-10'>
            <p
              class='w-5/6 px-5 mx-auto text-slate-300 tracking-tighter break-words
                  whitespace-pre-line overflow-y-scroll xl:custom-scrollbar h-full'
            >
              {props.event.content}
            </p>
          </div>
        </Show>
      </Show>
    </>
  );
};

export default EventContent;
