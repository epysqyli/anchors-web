import Menu from "~/components/shared/Menu";
import OverlayContext from "~/contexts/overlay";
import { Rerun } from "@solid-primitives/keyed";
import { useBeforeLeave, useIsRouting } from "@solidjs/router";
import { Motion, Presence } from "@motionone/solid";
import menuTogglerContext from "~/contexts/menuToggle";
import { Accessor, Component, JSX, Show, useContext } from "solid-js";

interface Props {
  children: JSX.Element;
  toggleMenu: () => void;
  showMenu: Accessor<boolean>;
}

const NarrowLayout: Component<Props> = (props) => {
  const isRouting = useIsRouting();

  const overlay = useContext(OverlayContext);
  const menuToggler = useContext(menuTogglerContext);

  useBeforeLeave(() => {
    overlay.showOverlay() && overlay.toggleOverlay();
    !menuToggler.showMenuButton() && menuToggler.toggleMenu();
  });

  return (
    <div
      class='h-[100vh] bg-gradient-to-bl from-slate-700
       via-slate-700 via-20% to-gray-800 to-80% relative'
    >
      <Presence exitBeforeEnter>
        <Show when={props.showMenu()}>
          <Motion.div
            class='fixed top-0 left-0 w-screen z-10'
            initial={{ scale: 1.05, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ easing: "ease-out" }}
            exit={{ scale: 1.05, opacity: 0 }}
          >
            <Menu isNarrow={true} toggleMenu={props.toggleMenu} />
          </Motion.div>
        </Show>
      </Presence>

      <Show when={menuToggler.showMenuButton()}>
        <Motion.button
          animate={{
            width: ["1rem", "3rem"],
            height: ["1rem", "3rem"]
          }}
          transition={{ duration: 0.5 }}
          class='border-4 border-slate-300 rounded-full
              bg-slate-200 cursor-pointer hover:bg-slate-300
                fixed left-1/2 -translate-x-1/2 bottom-4 select-none
                active:scale-95 active:border-orange-200 active:bg-orange-50
                transition-transform shadow-lg shadow-slate-900 z-10'
          onclick={props.toggleMenu}
        ></Motion.button>
      </Show>

      <Rerun on={isRouting()}>{props.children}</Rerun>
      {overlay.showOverlay() ? overlay.div : <></>}
    </div>
  );
};

export default NarrowLayout;
