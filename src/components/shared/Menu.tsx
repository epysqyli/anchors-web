import { A } from "@solidjs/router";
import { FiEdit } from "solid-icons/fi";
import { useLocation } from "solid-start";
import { BsSearch } from "solid-icons/bs";
import { Component, Show } from "solid-js";
import RelaySelector from "../menu/RelaySelector";
import { IoSettingsOutline } from "solid-icons/io";
import FollowingSelector from "../menu/FollowingSelector";
import AnchorsModeSelector from "../menu/AnchorsModeSelector";

interface Props {
  isNarrow: boolean | undefined;
  toggleMenu: () => void; // handle for mobile view
}

const Menu: Component<Props> = (props) => {
  const location = useLocation();

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
          <div class='my-5 group w-fit mx-auto'>
            <AnchorsModeSelector />
          </div>

          <div class='mx-auto w-5/6 mt-10 mb-16 px-2 h-[25%]'>
            <div class='flex justify-around my-5'>
              <FollowingSelector />
            </div>
            <RelaySelector />
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
