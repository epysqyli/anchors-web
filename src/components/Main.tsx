import { Motion, Presence } from "@motionone/solid";
import { Component, Show, createSignal } from "solid-js";
import Menu from "./Menu";

const Main: Component<{ isNarrow: boolean | undefined }> = (props) => {
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
            <div class="snap-start h-[100vh] text-white text-xl pt-10 mx-auto w-4/5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi vero
              iusto totam dolores suscipit similique quis placeat et ipsam
              neque. Necessitatibus adipisci consequuntur quidem iure vero
              repudiandae assumenda quia et?
            </div>
            <div class="snap-start h-[100vh] text-white text-xl pt-10 mx-auto w-4/5">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima
              optio, a suscipit iusto laborum beatae ipsum veniam expedita
              obcaecati soluta officia in dolores, et voluptatum omnis similique
              neque! Maiores, temporibus!
            </div>
            <div class="snap-start h-[100vh] text-white text-xl pt-10 mx-auto w-4/5">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Provident molestias sunt aut. Maiores, ullam ex! Vitae non a in
              magnam accusantium soluta adipisci aspernatur alias, ut molestias,
              architecto perferendis id!
            </div>
            <div class="snap-start h-[100vh] text-white text-xl pt-10 mx-auto w-4/5">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa
              dignissimos repellendus excepturi nihil sit veritatis suscipit,
              dolores vero provident tempore nobis, aperiam beatae reprehenderit
              culpa quasi. Eum iure doloremque fugit?
            </div>
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
                   active:scale-95 active:border-orange-200 active:bg-orange-50 transition-transform"
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
              <div class="snap-start h-[90vh] text-white text-2xl p-10 mx-auto w-4/5 2xl:w-3/5 2xl:p-16">
                <div class="h-[80vh] rounded-md">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi
                  vero iusto totam dolores suscipit similique quis placeat et
                  ipsam neque. Necessitatibus adipisci consequuntur quidem iure
                  vero repudiandae assumenda quia et?
                </div>
              </div>
              <div class="snap-start h-[90vh] text-white text-2xl p-10 mx-auto w-4/5 2xl:w-3/5 2xl:p-16">
                <div class="h-[80vh] rounded-md">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Minima optio, a suscipit iusto laborum beatae ipsum veniam
                  expedita obcaecati soluta officia in dolores, et voluptatum
                  omnis similique neque! Maiores, temporibus!
                </div>
              </div>
              <div class="snap-start h-[90vh] text-white text-2xl p-10 mx-auto w-4/5 2xl:w-3/5 2xl:p-16">
                <div class="h-[80vh] rounded-md">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Provident molestias sunt aut. Maiores, ullam ex! Vitae non a
                  in magnam accusantium soluta adipisci aspernatur alias, ut
                  molestias, architecto perferendis id!
                </div>
              </div>
              <div class="snap-start h-[90vh] text-white text-2xl p-10 mx-auto w-4/5 2xl:w-3/5 2xl:p-16">
                <div class="h-[80vh] rounded-md">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa
                  dignissimos repellendus excepturi nihil sit veritatis
                  suscipit, dolores vero provident tempore nobis, aperiam beatae
                  reprehenderit culpa quasi. Eum iure doloremque fugit?
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default Main;
