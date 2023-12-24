if ("serviceWorker" in navigator) {
  window.addEventListener("DOMContentLoaded", () => {
    navigator.serviceWorker.register("spotify-token-worker", { scope: "/" });
  });
}
