import Menu from "~/components/Menu";
import { Component, JSX, useContext } from "solid-js";
import { Rerun } from "@solid-primitives/keyed";
import { Motion, Presence } from "@motionone/solid";
import { useIsRouting } from "solid-start";
import OverlayContext from "~/contexts/overlay";

interface Props {
  children: JSX.Element;
  toggleMenu: () => void;
}

const WideLayout: Component<Props> = (props) => {
  const isRouting = useIsRouting();
  const overlay = useContext(OverlayContext);
  const overlayDiv = (
    <div class="absolute bg-slate-900 h-full w-full top-0 left-0 opacity-75 z-0"></div>
  );

  return (
    <div class="h-screen flex gap-x-3 px-2 md:gap-x-2 md:px-2 justify-center items-center">
      <div class="h-[98vh] w-1/5">
        <Menu isNarrow={false} toggleMenu={props.toggleMenu} />
      </div>

      <Presence exitBeforeEnter>
        <Rerun on={isRouting()}>
          <Motion.div
            animate={{ opacity: [0.5, 1] }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: [1, 0], transition: { duration: 0.3 } }}
            class="h-[98vh] w-4/5 rounded-md bg-gradient-to-bl from-slate-700
          via-slate-700 via-20% to-gray-800 to-80% relative"
          >
            {props.children}
            {overlay.showOverlay() ? overlayDiv : <></>}
          </Motion.div>
        </Rerun>
      </Presence>
    </div>
  );
};

export default WideLayout;
