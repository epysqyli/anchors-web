// @refresh reload
import { Component, Suspense } from "solid-js";
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

const Root: Component<{}> = () => {
  return (
    <Html lang="en">
      <Head>
        <Title>Anchors</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
};

export default Root;
