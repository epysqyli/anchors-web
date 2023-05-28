import { Setter, createEffect, createSignal } from "solid-js";

const useMediaQuery = (query: string, setFn: Setter<boolean>): void => {
  const [isMatch, setIsMatch] = createSignal<boolean>(false);

  createEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== isMatch()) {
      setIsMatch(media.matches);
    }

    window.addEventListener("resize", () => setIsMatch(media.matches));
    setFn(isMatch());
  });
};


/**
 * set signals and call useIsNarrow from components as follows
 * const [isNarrow, setIsNarrow] = createSignal<boolean | undefined>();
 * useIsNarrow(setIsNarrow);
 * then wrap into <Show when={isNarrow() !== undefined}>
 */
const useIsNarrow = (setFn: Setter<boolean>): void => {
  useMediaQuery("(max-width: 1024px)", setFn);
};

export { useIsNarrow };
