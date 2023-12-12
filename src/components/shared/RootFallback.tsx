import { Motion } from "@motionone/solid";
import { JSX, Show, VoidComponent } from "solid-js";
import LoadingPoints from "../feed/LoadingPoints";
import { FiAnchor } from "solid-icons/fi";
import { useIsNarrow } from "~/hooks/useMediaQuery";

const RootFallback: VoidComponent = (): JSX.Element => {
  return (
    <>
      <Show when={useIsNarrow() != undefined && useIsNarrow()}>
        <div class='flex flex-col justify-center h-full bg-gradient-to-bl from-slate-700 via-slate-700 via-20% to-gray-800 to-80%'>
          <div class='text-slate-100 bg-slate-700 mx-auto animate-bounce border-neutral-600 rounded-full p-5'>
            <FiAnchor size={42} />
          </div>
        </div>
      </Show>

      <Show when={useIsNarrow() != undefined && !useIsNarrow()}>
        <div class='h-full gap-x-3 px-2 md:gap-x-2 md:px-2 grid grid-cols-5 items-center'>
          <div class='h-[98vh] col-span-1 bg-neutral-700 bg-opacity-50'>
            <div class='h-1/6 flex flex-col justify-center'>
              <div
                class='text-slate-100 w-fit mx-auto cursor-pointer transition bg-neutral-700
                    animate-bounce border-neutral-600 active:bg-slate-500 rounded-full p-3'
              >
                <FiAnchor size={40} />
              </div>
            </div>

            <div class='h-5/6 flex flex-col justify-between animate-pulse py-10'>
              <div class='bg-neutral-700 bg-opacity-30 h-[10%] my-1 w-[90%] rounded-md mx-auto'></div>
              <div class='bg-neutral-700 bg-opacity-30 h-[10%] my-1 w-[90%] rounded-md mx-auto'></div>
              <div class='bg-neutral-700 bg-opacity-30 h-[10%] my-1 w-[90%] rounded-md mx-auto'></div>
              <div class='bg-neutral-700 bg-opacity-30 h-[10%] my-1 w-[90%] rounded-md mx-auto'></div>
              <div class='bg-neutral-700 bg-opacity-30 h-[10%] my-1 w-[90%] rounded-md mx-auto'></div>
              <div class='bg-neutral-700 bg-opacity-30 h-[10%] my-1 w-[90%] rounded-md mx-auto'></div>
              <div class='bg-neutral-700 bg-opacity-30 h-[10%] my-1 w-[90%] rounded-md mx-auto'></div>
              <div class='bg-neutral-700 bg-opacity-30 h-[10%] my-1 w-[90%] rounded-md mx-auto'></div>
            </div>
          </div>

          <Motion.div
            animate={{ opacity: [0.5, 1] }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: [1, 0], transition: { duration: 0.3 } }}
            class='h-[98vh] col-span-4 rounded-md bg-gradient-to-bl from-slate-700
              via-slate-700 via-20% to-gray-800 to-80% relative py-2 z-30'
          >
            <LoadingPoints />
          </Motion.div>
        </div>
      </Show>
    </>
  );
};

export default RootFallback;
