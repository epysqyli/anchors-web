import Main from "~/components/Main";
import Menu from "~/components/Menu";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import { Component, Show, createSignal } from "solid-js";

const Home: Component<{}> = () => {
  const [isNarrow, setIsNarrow] = createSignal<boolean | undefined>(undefined);
  useIsNarrow(setIsNarrow);

  return (
    <>
      <Show when={isNarrow() !== undefined && isNarrow()}>
        <>
          <Main isNarrow={isNarrow()} />
        </>
      </Show>

      <Show when={isNarrow() !== undefined && !isNarrow()}>
        <div class="h-screen flex gap-x-3 px-2 2xl:gap-x-4 2xl:px-5 justify-center items-center">
          <div class="h-[96vh] w-1/5">
            <Menu isNarrow={isNarrow()} />
          </div>

          <div class="h-[96vh] w-4/5">
            <Main isNarrow={isNarrow()} />
          </div>
        </div>
      </Show>
    </>
  );
};

export default Home;
