import { A } from "@solidjs/router";
import { CgFeed } from "solid-icons/cg";
import { BsGlobe2 } from "solid-icons/bs";
import { useLocation } from "solid-start";
import { Component, Show } from "solid-js";
import { FiAnchor, FiEdit } from "solid-icons/fi";
import { IoSettingsOutline } from "solid-icons/io";
import { BsStack, BsSearch } from "solid-icons/bs";

interface Props {
  isNarrow: boolean | undefined;
  toggleMenu: () => void;
}

const Menu: Component<Props> = (props) => {
  const location = useLocation();

  const narrowStyle = `text-lg bg-gradient-to-br from-slate-600 via-slate-700
                       via-20% to-gray-900 to-90% pt-10 h-[100vh]`;

  const wideStyle = `rounded-md text-lg relative overflow-y-auto bg-neutral-700 bg-opacity-75 h-full pt-10`;

  const actionStyle = `text-slate-50 w-5/6 mx-auto my-3 select-none
                       bg-gradient-to-r from-slate-800 to-gray-700
                       md:bg-none md:px-5 md:py-8 p-4 rounded-md
                       transition cursor-pointer group active:scale-90
                       hover:bg-slate-600 hover:text-orange-200
                       border-transparent border-2`;

  const flexActionStyle = actionStyle + " flex items-center justify-between";
  const selectedFlexActionStyle = flexActionStyle + " md:border-orange-200 md:bg-slate-700";

  const selectedActionStyle = actionStyle + " md:border-orange-200 md:bg-slate-700";
  const active = (path: string) => path == `${location.pathname}${location.search}`;

  return (
    <>
      <Show when={props.isNarrow !== undefined}>
        <div class={props.isNarrow ? narrowStyle : wideStyle}>
          <div class='text-slate-100 w-fit mx-auto mt-10 mb-10 md:mb-20'>
            <FiAnchor size={40} />
          </div>

          <div class='flex w-11/12 mx-auto'>
            <A class="w-1/2" onClick={props.toggleMenu} href='/'>
              <div class={active("/") ? selectedActionStyle : actionStyle}>
                <CgFeed size={30} class='md:group-hover:animate-pulse mx-auto' />
                <div class='text-center text-slate-300 text-sm mt-5'>following feed</div>
              </div>
            </A>
            <A class="w-1/2" onClick={props.toggleMenu} href='/?feed=global'>
              <div class={active("/?feed=global") ? selectedActionStyle : actionStyle}>
                <BsGlobe2 size={30} class='md:group-hover:animate-pulse mx-auto' />
                <div class='text-center text-slate-300 text-sm mt-5'>global feed</div>
              </div>
            </A>
          </div>

          <A onClick={props.toggleMenu} href='/write'>
            <div class={active("/write") ? selectedFlexActionStyle : flexActionStyle}>
              <FiEdit size={26} class='md:group-hover:animate-pulse' />
              <div class='group-hover:scale-95'>write</div>
            </div>
          </A>

          <A onClick={props.toggleMenu} href='/search'>
            <div class={active("/search") ? selectedFlexActionStyle : flexActionStyle}>
              <BsSearch size={26} class='md:group-hover:animate-pulse' />
              <div class='group-hover:scale-95'>search</div>
            </div>
          </A>

          <A onClick={props.toggleMenu} href='/my-posts'>
            <div class={active("/my-posts") ? selectedFlexActionStyle : flexActionStyle}>
              <BsStack size={26} class='md:group-hover:animate-pulse' />
              <div class='group-hover:scale-95'>my posts</div>
            </div>
          </A>

          <A onClick={props.toggleMenu} href='/settings'>
            <div class={active("/settings") ? selectedFlexActionStyle : flexActionStyle}>
              <IoSettingsOutline size={26} class='md:group-hover:animate-pulse' />
              <div class='group-hover:scale-95'>settings</div>
            </div>
          </A>
        </div>
      </Show>
    </>
  );
};

export default Menu;
