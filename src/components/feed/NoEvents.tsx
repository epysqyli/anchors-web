import { CgFeed } from "solid-icons/cg";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import { JSX, Show, VoidComponent } from "solid-js";

const NoEvents: VoidComponent = (): JSX.Element => (
  <>
    <Show when={useIsNarrow() != undefined && useIsNarrow()}>
      <div class='relative snap-start h-[100dvh] text-neutral-300'>
        <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-20 text-slate-300 shadow-slate-500 w-[90vw]'>
          <CgFeed size={80} class='mx-auto' stroke-width={1} />
          <p class='text-center mt-10 text-xl select-none mx-auto'>No (more) posts in this feed</p>
        </div>
      </div>
    </Show>

    <Show when={useIsNarrow() != undefined && !useIsNarrow()}>
      <div class='relative snap-start h-full text-slate-300'>
        <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-20 text-neutral-300'>
          <CgFeed size={80} class='mx-auto' stroke-width={1} />
          <p class='text-center mt-10 text-lg select-none mx-auto'>No (more) posts in this feed</p>
        </div>
      </div>
    </Show>
  </>
);

export default NoEvents;
