// @refresh reload
import "./root.css";

import { Routes } from "@solidjs/router";
import WideLayout from "./layouts/WideLayout";
import NarrowLayout from "./layouts/NarrowLayout";
import { Event, EventTemplate } from "nostr-tools";
import { useIsNarrow } from "./hooks/useMediaQuery";
import { ErrorBoundary } from "solid-start/error-boundary";
import UserIdentity from "./components/shared/UserIdentity";
import RootFallback from "./components/shared/RootFallback";
import { RelayContext, RelayProvider } from "./contexts/relay";
import { Component, Show, Suspense, useContext } from "solid-js";
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
  const { setupDone } = useContext(RelayContext);

  return (
    <Html lang='en'>
      <Head>
        <Title>Anchors</Title>
        <Meta charset='utf-8' />
        <Meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta name='theme-color' content='#1e293b' />
        <script src='serviceWorkerInit.ts' />
      </Head>

      <Body class='h-screen bg-gray-900 xl:custom-scrollbar'>
        <Suspense>
          <ErrorBoundary>
            <RelayProvider>
              <Show when={setupDone()} fallback={<RootFallback />}>
                <Show when={useIsNarrow() !== undefined && useIsNarrow()}>
                  <NarrowLayout>
                    <Routes>
                      <FileRoutes />
                    </Routes>

                    <UserIdentity />
                  </NarrowLayout>
                </Show>

                <Show when={useIsNarrow() !== undefined && !useIsNarrow()}>
                  <WideLayout>
                    <Routes>
                      <FileRoutes />
                    </Routes>

                    <UserIdentity />
                  </WideLayout>
                </Show>
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
