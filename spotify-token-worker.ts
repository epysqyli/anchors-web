/// <reference lib="WebWorker" />

import ISpotifyTokenResp from "src/interfaces/ISpotifyTokenResp";
declare const self: ServiceWorkerGlobalScope;
export type {};

self.addEventListener("install", (ev) => {
  ev.waitUntil(self.skipWaiting());
  console.log("[SW] service worker installed");
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(self.clients.claim());
  console.log("[SW] service worker ready");
});

let spotifyAccessToken: string = "";

self.addEventListener("message", (ev) => {
  const spotifyResponse: ISpotifyTokenResp = ev.data;
  if (spotifyResponse.tokenProvider == "spotify" && spotifyResponse.tokenOp == "set") {
    spotifyAccessToken = spotifyResponse.access_token;
  }
});

self.addEventListener("fetch", (ev) => {
  if (ev.request.url.includes("api.spotify.com/v1/")) {
    const searchRequest = new Request(ev.request, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${spotifyAccessToken}`,
        "Content-Type": "application/json"
      })
    });

    ev.respondWith((async () => fetch(searchRequest))());
  }
});
