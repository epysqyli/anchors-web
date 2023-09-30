import OverlayContext from "~/contexts/overlay";
import { Motion, Presence } from "@motionone/solid";
import { RiSystemCloseCircleFill } from "solid-icons/ri";
import { Accessor, Component, JSX, Setter, Show, createEffect, createSignal, useContext } from "solid-js";

interface Props {
  children: JSX.Element;
  show: Accessor<boolean>;
  setShow: Setter<boolean>;
  autoClose: boolean;
  largeHeight?: boolean;
  secondLayer?: boolean;
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
        }, 3000);
      }

      if (!props.show()) {
        setOverlayAlreadyApplied(false);
      }
    });
  } else {
    createEffect(() => {
      if (!overlayAlreadyApplied() && props.show() && !props.secondLayer) {
        overlayContext.toggleOverlay();
        setOverlayAlreadyApplied(true);
      }
    });
  }

  const closePopup = (): void => {
    props.setShow(false);

    if (props.secondLayer) {
      return;
    }

    overlayContext.toggleOverlay();
    setOverlayAlreadyApplied(false);
  };

  const closeButton = (): JSX.Element => {
    if (!props.autoClose) {
      return (
        <div
          onClick={closePopup}
          class='absolute -top-2 -right-2 text-white cursor-pointer hover:scale-105 active:scale-95'
        >
          <RiSystemCloseCircleFill size={28} />
        </div>
      );
    }

    return <></>;
  };

  const popupStyle = (): string => {
    const baseStyle = "relative tracking-tight rounded-md shadow-md text-slate-200 text-center text-lg z-20";

    if (props.secondLayer && props.largeHeight) {
      return `${baseStyle} h-[50vh] bg-slate-800`;
    }

    if (props.largeHeight) {
      return `${baseStyle} h-[70vh] bg-gray-800 bg-opacity-90`;
    }

    return `${baseStyle} h-[25vh] bg-neutral-700`;
  };

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
          class={popupStyle()}
        >
          {closeButton()}
          <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5/6 mx-auto h-full'>
            {props.children}
          </div>
        </Motion.div>
      </Show>
    </Presence>
  );
};

export default Popup;
