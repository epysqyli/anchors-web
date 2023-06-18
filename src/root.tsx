// @refresh reload
import "./root.css";
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
import WideLayout from "./layouts/WideLayout";
import { RelayProvider } from "./contexts/relay";
import NarrowLayout from "./layouts/NarrowLayout";
import { useIsNarrow } from "./hooks/useMediaQuery";

const Root: Component<{}> = () => {
  useIsNarrow();

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
                </WideLayout>
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
