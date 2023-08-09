import OverlayContext from "~/contexts/overlay";
import { Motion, Presence } from "@motionone/solid";
import { Accessor, Component, JSX, Setter, Show, createEffect, createSignal, useContext } from "solid-js";

interface Props {
  children: JSX.Element;
  show: Accessor<boolean>;
  setShow: Setter<boolean>;
  autoClose: boolean;
}

const Popup: Component<Props> = (props) => {
  const overlayContext = useContext(OverlayContext);
  const [overlayAlreadyApplied, setOverlayAlreadyApplied] = createSignal<boolean>(false);

  if (props.autoClose) {
    createEffect(() => {
      if (!overlayAlreadyApplied() && props.show()) {
        overlayContext.toggleOverlay();
        setOverlayAlreadyApplied(true);

        setTimeout(() => {
          overlayContext.toggleOverlay();
          props.setShow(false);
        }, 2000);
      }

      if (!props.show()) {
        setOverlayAlreadyApplied(false);
      }
    });
  }

  return (
    <Presence exitBeforeEnter>
      <Show when={props.show()}>
        <Motion.div
          animate={{
            opacity: [0.5, 0.9, 1],
            scale: [0.4, 1.05, 1],
            transition: { duration: 0.3, easing: "ease-out" }
          }}
          exit={{
            opacity: [1, 0.9, 0.5],
            scale: [1, 1.05, 0.1],
            transition: {
              duration: 0.2,
              easing: "ease-out"
            }
          }}
          transition={{ easing: "ease-out", duration: 0.2 }}
          class='relative tracking-tight px-12 py-16 bg-neutral-700 bg-opacity-90
                rounded-md shadow-md text-slate-200 text-center text-lg '
        >
          {props.children}
        </Motion.div>
      </Show>
    </Presence>
  );
};

export default Popup;
