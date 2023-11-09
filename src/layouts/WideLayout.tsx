import Menu from "~/components/shared/Menu";
import { useIsRouting } from "solid-start";
import { Rerun } from "@solid-primitives/keyed";
import OverlayContext from "~/contexts/overlay";
import { useBeforeLeave } from "@solidjs/router";
import { Motion, Presence } from "@motionone/solid";
import { Component, JSX, useContext } from "solid-js";
import menuTogglerContext from "~/contexts/menuToggle";

interface Props {
  children: JSX.Element;
}

const WideLayout: Component<Props> = (props) => {
  const isRouting = useIsRouting();

  const overlay = useContext(OverlayContext);
  const menuToggleCtx = useContext(menuTogglerContext);

  useBeforeLeave(() => {
    overlay.showOverlay() && overlay.toggleOverlay();
  });

  return (
    <div class='h-full gap-x-3 px-2 md:gap-x-2 md:px-2 grid grid-cols-5 items-center'>
      <div class='h-[98vh] col-span-1'>
        <Menu />
      </div>

      <Presence exitBeforeEnter>
        <Rerun on={isRouting()}>
          <Motion.div
            animate={{ opacity: [0.5, 1] }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: [1, 0], transition: { duration: 0.3 } }}
            class='h-[98vh] col-span-4 rounded-md bg-gradient-to-bl from-slate-700
                  via-slate-700 via-20% to-gray-800 to-80% relative py-2 z-30'
          >
            {props.children}
            {overlay.showOverlay() ? overlay.div : <></>}
          </Motion.div>
        </Rerun>
      </Presence>
    </div>
  );
};

export default WideLayout;
