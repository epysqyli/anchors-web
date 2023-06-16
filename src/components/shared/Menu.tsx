import { A } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { CgFeed } from "solid-icons/cg";
import { FiAnchor, FiEdit } from "solid-icons/fi";
import { IoSettingsOutline } from "solid-icons/io";
import { useLocation } from "solid-start";
import { BsStack, BsSearch } from 'solid-icons/bs'

interface Props {
  isNarrow: boolean | undefined;
  toggleMenu: () => void;
}

const Menu: Component<Props> = (props) => {
  const location = useLocation();

  const narrowStyle = `text-lg bg-gradient-to-br from-slate-600 via-slate-700
                       via-20% to-gray-900 to-90% pt-10 h-[100vh]`;

  const wideStyle = `rounded-md text-lg bg-gradient-to-br from-slate-600
                     via-slate-700 via-20% to-gray-900 to-90% relative
                     overflow-y-auto h-full pt-10`;

  const actionStyle = `text-slate-50 w-5/6 mx-auto my-2 select-none
                       bg-gradient-to-r from-slate-800 to-gray-700
                       hover:bg-slate-600 p-4 rounded-md text-center lg:text-left
                       transition cursor-pointer group active:scale-90
                       hover:text-orange-200 flex items-center justify-between
                       border border-transparent`;

  const selectedActionStyle = actionStyle + "border-solid border-slate-200 border-opacity-50";
  const active = (path: string) => path == location.pathname;

  return (
    <>
      <Show when={props.isNarrow !== undefined}>
        <div class={props.isNarrow ? narrowStyle : wideStyle}>
          <div class="text-slate-100 w-fit mx-auto mt-10 mb-10 md:mb-20 ">
            <FiAnchor size={40} />
          </div>

          <A onClick={props.toggleMenu} href="/">
            <div class={active("/") ? selectedActionStyle : actionStyle}>
              <CgFeed size={26} />
              <div class="group-hover:scale-95">feed</div>
            </div>
          </A>

          <A onClick={props.toggleMenu} href="/write">
            <div class={active("/write") ? selectedActionStyle : actionStyle}>
              <FiEdit size={26} />
              <div class="group-hover:scale-95">write</div>
            </div>
          </A>

          <A onClick={props.toggleMenu} href="/search">
            <div class={active("/search") ? selectedActionStyle : actionStyle}>
              <BsSearch size={26} />
              <div class="group-hover:scale-95">search</div>
            </div>
          </A>

          <A onClick={props.toggleMenu} href="/my-posts">
            <div class={active("/my-posts") ? selectedActionStyle : actionStyle}>
              <BsStack size={26} />
              <div class="group-hover:scale-95">my posts</div>
            </div>
          </A>

          <A onClick={props.toggleMenu} href="/settings">
            <div class={active("/settings") ? selectedActionStyle : actionStyle}>
              <IoSettingsOutline size={26} />
              <div class="group-hover:scale-95">settings</div>
            </div>
          </A>
        </div>
      </Show>
    </>
  );
};

export default Menu;
