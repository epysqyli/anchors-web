import { A } from "@solidjs/router";
import { CgFeed } from "solid-icons/cg";
import { useLocation } from "solid-start";
import { BsSearch } from "solid-icons/bs";
import { Motion } from "@motionone/solid";
import { TbStack2 } from "solid-icons/tb";
import { RelayContext } from "~/contexts/relay";
import { FiAnchor, FiEdit } from "solid-icons/fi";
import { IoSettingsOutline } from "solid-icons/io";
import { BsBookmark, BsGlobe2 } from "solid-icons/bs";
import { Component, Show, useContext } from "solid-js";

interface Props {
  isNarrow: boolean | undefined;
  toggleMenu: () => void;
}

const Menu: Component<Props> = (props) => {
  const location = useLocation();
  const { isAnchorsMode, setIsAnchorsMode } = useContext(RelayContext);

  const toggleAnchorsMode = (): void => {
    setIsAnchorsMode(!isAnchorsMode());
  };

  const narrowStyle = `text-lg bg-gradient-to-br from-slate-600 via-slate-700
                       via-20% to-gray-900 to-90% pt-10 h-[100vh]`;

  const wideStyle = `rounded-md text-lg relative overflow-y-auto bg-neutral-700 bg-opacity-75 h-full pt-10`;

  const actionStyle = `text-neutral-300 w-3/4 mx-auto my-3 select-none
                       bg-gradient-to-r from-slate-800 to-gray-700
                       md:bg-none md:px-5 md:py-5 p-4 transition cursor-pointer 
                       group active:scale-90 hover:bg-slate-600 hover:text-orange-200
                       border-b border-neutral-600 rounded`;

  const flexActionStyle = actionStyle + " flex items-center justify-between";
  const selectedFlexActionStyle = flexActionStyle + " md:border-orange-200 md:bg-slate-700";
  const selectedActionStyle = actionStyle + " md:border-orange-200 md:bg-slate-700";

  const active = (path: string) => {
    if (path == `${location.pathname}${location.search}`) {
      return true;
    }

    if (location.pathname.includes(path) && path !== "/") {
      return true;
    }

    return false;
  };

  return (
    <>
      <Show when={props.isNarrow !== undefined}>
        <div class={props.isNarrow ? narrowStyle : wideStyle}>
          <div class='mt-10 mb-10 md:mb-16 group w-fit mx-auto'>
            <div
              onClick={toggleAnchorsMode}
              class='text-slate-100 w-fit mx-auto cursor-pointer transition
                   border-2 border-dashed border-neutral-500 hover:bg-neutral-500
                   hover:border-neutral-600 rounded-full p-3 active:bg-neutral-700'
            >
              {isAnchorsMode() ? (
                <Motion.div animate={{ scale: [0.7, 1] }}>
                  <FiAnchor size={40} />
                </Motion.div>
              ) : (
                <Motion.div animate={{ scale: [0.7, 1] }}>
                  <BsGlobe2 size={40} />
                </Motion.div>
              )}
            </div>

            <div
              class='mt-3 rounded px-2 py-1 text-sm bg-transparent text-transparent
                      group-hover:text-neutral-300 group-hover:bg-neutral-600 transition'
            >
              switch to {isAnchorsMode() ? "all nostr" : "only anchors"} posts
            </div>
          </div>

          <div class='flex w-5/6 mx-auto'>
            <A class='w-1/2' onClick={props.toggleMenu} href='/'>
              <div class={active("/") ? selectedActionStyle : actionStyle}>
                <CgFeed size={30} class='md:group-hover:animate-pulse mx-auto' />
              </div>
            </A>
            <A class='w-1/2' onClick={props.toggleMenu} href='/?feed=global'>
              <div class={active("/?feed=global") ? selectedActionStyle : actionStyle}>
                <BsGlobe2 size={30} class='md:group-hover:animate-pulse mx-auto' />
              </div>
            </A>
          </div>

          <A onClick={props.toggleMenu} href='/write'>
            <div class={active("/write") ? selectedFlexActionStyle : flexActionStyle}>
              <div class='group-hover:scale-95'>write</div>
              <FiEdit size={26} class='md:group-hover:animate-pulse' />
            </div>
          </A>

          <A onClick={props.toggleMenu} href='/search'>
            <div class={active("/search") ? selectedFlexActionStyle : flexActionStyle}>
              <div class='group-hover:scale-95'>search</div>
              <BsSearch size={26} class='md:group-hover:animate-pulse' />
            </div>
          </A>

          <A onClick={props.toggleMenu} href='/saved-posts'>
            <div class={active("/saved-posts") ? selectedFlexActionStyle : flexActionStyle}>
              <div class='group-hover:scale-95'>saved posts</div>
              <BsBookmark size={26} class='md:group-hover:animate-pulse' />
            </div>
          </A>

          <A onClick={props.toggleMenu} href='/my-posts'>
            <div class={active("/my-posts") ? selectedFlexActionStyle : flexActionStyle}>
              <div class='group-hover:scale-95'>my posts</div>
              <TbStack2 size={28} class='md:group-hover:animate-pulse' />
            </div>
          </A>

          <A onClick={props.toggleMenu} href='/settings'>
            <div class={active("/settings") ? selectedFlexActionStyle : flexActionStyle}>
              <div class='group-hover:scale-95'>profile</div>
              <IoSettingsOutline size={26} class='md:group-hover:animate-pulse' />
            </div>
          </A>
        </div>
      </Show>
    </>
  );
};

export default Menu;
