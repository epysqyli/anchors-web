// @refresh reload
import { Component, Show, Suspense, createSignal } from "solid-js";
import { Routes } from "@solidjs/router";
import { ErrorBoundary } from "solid-start/error-boundary";
import {
  Body,
  FileRoutes,
  Head,
  Html,
  Meta,
  Scripts,
  Title,
} from "solid-start";
import "./root.css";
import { RelayProvider } from "./contexts/relay";
import { useIsNarrow } from "./hooks/useMediaQuery";
import Menu from "./components/Menu";
import { Motion, Presence } from "@motionone/solid";

const Root: Component<{}> = () => {
  const [isNarrow, setIsNarrow] = createSignal<boolean | undefined>(undefined);
  useIsNarrow(setIsNarrow);

  const [showMenu, setShowMenu] = createSignal<boolean>(false);
  const toggleMenu = (): void => {
    setShowMenu(!showMenu());
  };

  return (
    <RelayProvider>
      <Html lang="en">
        <Head>
          <Title>Anchors</Title>
          <Meta charset="utf-8" />
          <Meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta name="theme-color" content="#1e293b" />
        </Head>
        <Body class="h-screen bg-gray-900">
          <Suspense>
            <ErrorBoundary>
              <Show when={isNarrow() !== undefined && isNarrow()}>
                <div
                  class="h-[100vh] bg-gradient-to-bl from-slate-700
                       via-slate-700 via-20% to-gray-800 to-80% relative"
                >
                  <Presence exitBeforeEnter>
                    <Show when={showMenu()}>
                      <Motion.div
                        class="fixed top-0 left-0 w-screen"
                        initial={{ scale: 1.05, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ easing: "ease-out" }}
                        exit={{ scale: 1.05, opacity: 0 }}
                      >
                        <Menu isNarrow={isNarrow()} toggleMenu={toggleMenu} />
                      </Motion.div>
                    </Show>
                  </Presence>

                  <Motion.button
                    animate={{
                      width: ["1rem", "3rem"],
                      height: ["1rem", "3rem"],
                    }}
                    transition={{ duration: 0.5 }}
                    class="border-4 border-slate-300 rounded-full
                          bg-slate-200 cursor-pointer hover:bg-slate-300
                          fixed left-1/2 -translate-x-1/2 bottom-20 select-none
                          active:scale-95 active:border-orange-200 active:bg-orange-50
                          transition-transform shadow-lg shadow-slate-900"
                    onclick={toggleMenu}
                  ></Motion.button>

                  <Routes>
                    <FileRoutes />
                  </Routes>
                </div>
              </Show>

              <Show when={isNarrow() !== undefined && !isNarrow()}>
                <div class="h-screen flex gap-x-3 px-2 2xl:gap-x-4 2xl:px-5 justify-center items-center">
                  <div class="h-[96vh] w-1/5">
                    <Menu isNarrow={isNarrow()} toggleMenu={toggleMenu} />
                  </div>

                  <div
                    class="h-[96vh] w-4/5 rounded-md bg-gradient-to-bl from-slate-700
                           via-slate-700 via-20% to-gray-800 to-80%"
                  >
                    <Routes>
                      <FileRoutes />
                    </Routes>
                  </div>
                </div>
              </Show>
            </ErrorBoundary>
          </Suspense>
          <Scripts />
        </Body>
      </Html>
    </RelayProvider>
  );
};

export default Root;
