import { Show, VoidComponent } from "solid-js";
import { useIsNarrow } from "~/hooks/useMediaQuery";

const LoadingPoints: VoidComponent = () => {
  return (
    <>
      <Show when={useIsNarrow() !== undefined && useIsNarrow()}>
        <div class='h-[100dvh] w-screen relative'>
          <div class='animate-pulse text-slate-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50dvw]'>
            {Array.from({ length: 6 }).map((_) => {
              return (
                <div class='flex justify-around'>
                  {Array.from({ length: 10 }).map((_) => {
                    return <div class='w-1 h-1 rounded-full bg-white my-4'></div>;
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </Show>

      <Show when={useIsNarrow() !== undefined && !useIsNarrow()}>
        <div class='animate-pulse text-slate-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/5'>
          {Array.from({ length: 13 }).map((_) => {
            return (
              <div class='flex justify-around'>
                {Array.from({ length: 15 }).map((_) => {
                  return <div class='w-1 h-1 rounded-full bg-white my-4'></div>;
                })}
              </div>
            );
          })}
        </div>
      </Show>
    </>
  );
};

export default LoadingPoints;
