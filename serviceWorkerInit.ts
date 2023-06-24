if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("spotify-token-worker", { scope: "/" });
  });
}
