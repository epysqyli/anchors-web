import Menu from "./Menu";
import { Event } from "nostr-tools";
import { Motion, Presence } from "@motionone/solid";
import { Component, For, Show, createSignal } from "solid-js";

interface Props {
  isNarrow: boolean | undefined;
  events: Event[];
}

const Main: Component<Props> = (props) => {
  const [showMenu, setShowMenu] = createSignal<boolean>(false);

  const toggleMenu = (): void => {
    if (showMenu()) {
      setShowMenu(false);
    } else {
      setShowMenu(true);
    }
  };

  return (
    <>
      <Show when={props.isNarrow !== undefined && props.isNarrow}>
        <div
          class="h-[100vh] bg-gradient-to-bl from-slate-700
               via-slate-700 via-20% to-gray-800 to-80% relative"
        >
          <div class="snap-y snap-mandatory overflow-scroll overflow-x-hidden h-[100vh]">
            <For each={props.events}>
              {(nostrEvent) => (
                <div class="snap-start h-[100vh] text-white text-xl pt-10 mx-auto w-4/5">
                  {nostrEvent.content}
                </div>
              )}
            </For>
          </div>

          <Presence exitBeforeEnter>
            <Show when={showMenu()}>
              <Motion.div
                class="fixed top-0 left-0 w-screen"
                initial={{ scale: 1.05, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ easing: "ease-out" }}
                exit={{ scale: 1.05, opacity: 0 }}
              >
                <Menu isNarrow={props.isNarrow} />
              </Motion.div>
            </Show>
          </Presence>

          <Motion.button
            animate={{ width: ["1rem", "3rem"], height: ["1rem", "3rem"] }}
            transition={{ duration: 0.5 }}
            class="border-4 border-slate-300 rounded-full
                   bg-slate-200 cursor-pointer hover:bg-slate-300
                   fixed left-1/2 -translate-x-1/2 bottom-20 select-none
                   active:scale-95 active:border-orange-200 active:bg-orange-50 transition-transform
                   shadow-lg shadow-slate-900"
            onclick={toggleMenu}
          ></Motion.button>
        </div>
      </Show>

      <Show when={props.isNarrow !== undefined && !props.isNarrow}>
        <div
          class="h-full rounded-md bg-gradient-to-bl from-slate-700
            via-slate-700 via-20% to-gray-800 to-80%"
        >
          <div class="p-5">
            <div class="custom-scrollbar snap-y snap-mandatory overflow-scroll overflow-x-hidden h-[90vh]">
              <For each={props.events}>
                {(nostrEvent) => (
                  <div
                    class="snap-start h-[90vh] text-white text-2xl p-10
                                mx-auto w-4/5 2xl:w-3/5 2xl:p-16 rounded-md"
                  >
                    {nostrEvent.content}
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default Main;
