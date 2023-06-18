import { createEffect, createSignal } from "solid-js";

const [isNarrow, setIsNarrow] = createSignal<boolean | undefined>(undefined);

const useMediaQuery = (query: string): void => {
  const [isMatch, setIsMatch] = createSignal<boolean>(false);

  createEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== isMatch()) {
      setIsMatch(media.matches);
    }

    window.addEventListener("resize", () => setIsMatch(media.matches));
    setIsNarrow(isMatch());
  });
};


const useIsNarrow = (): boolean | undefined => {
  useMediaQuery("(max-width: 768px)");
  return isNarrow();
};

export { useIsNarrow };
