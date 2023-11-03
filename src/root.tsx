// @refresh reload
import "./root.css";
import { Routes } from "@solidjs/router";
import { Event, EventTemplate } from "nostr-tools";
import WideLayout from "./layouts/WideLayout";
import { RelayProvider } from "./contexts/relay";
import NarrowLayout from "./layouts/NarrowLayout";
import { useIsNarrow } from "./hooks/useMediaQuery";
import { ErrorBoundary } from "solid-start/error-boundary";
import UserIdentity from "./components/shared/UserIdentity";
import { Component, Show, Suspense, createSignal } from "solid-js";
import { Body, FileRoutes, Head, Html, Meta, Scripts, Title } from "solid-start";

declare global {
  interface Window {
    nostr: {
      signEvent(unsignedEvent: EventTemplate): Promise<Event>;
      getPublicKey(): Promise<string>;
    };
  }
}

const Root: Component<{}> = () => {
  const [initialLoad, setInitialLoad] = createSignal<boolean>(true);
  const [showMenu, setShowMenu] = createSignal<boolean>(false);
  const toggleMenu = (): void => {
    setShowMenu(!showMenu());
  };

  return (
    <Html lang='en'>
      <Head>
        <Title>Anchors</Title>
        <Meta charset='utf-8' />
        <Meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta name='theme-color' content='#1e293b' />
        <script src='serviceWorkerInit.ts' />
      </Head>

      <Body class='h-screen bg-gray-900 custom-scrollbar'>
        <Suspense>
          <ErrorBoundary>
            <RelayProvider>
              <Show when={useIsNarrow() !== undefined && useIsNarrow()}>
                <NarrowLayout showMenu={showMenu} toggleMenu={toggleMenu}>
                  <Routes>
                    <FileRoutes />
                  </Routes>
                </NarrowLayout>
              </Show>

              <Show when={useIsNarrow() !== undefined && !useIsNarrow()}>
                <WideLayout toggleMenu={toggleMenu}>
                  <Routes>
                    <FileRoutes />
                  </Routes>

                  <UserIdentity initialLoad={initialLoad} setInitialLoad={setInitialLoad} />
                </WideLayout>
              </Show>
            </RelayProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
};

export default Root;
