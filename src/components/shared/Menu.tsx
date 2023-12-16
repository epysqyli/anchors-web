import { A } from "@solidjs/router";
import { FiEdit } from "solid-icons/fi";
import { VsInfo } from "solid-icons/vs";
import { useLocation } from "solid-start";
import { BsBookmarks } from "solid-icons/bs";
import RelaySelector from "../menu/RelaySelector";
import { IoSettingsOutline } from "solid-icons/io";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import menuTogglerContext from "~/contexts/menuToggle";
import FollowingSelector from "../menu/FollowingSelector";
import AnchorsModeSelector from "../menu/AnchorsModeSelector";
import { JSX, Show, VoidComponent, useContext } from "solid-js";

const Menu: VoidComponent = (): JSX.Element => {
  const location = useLocation();

  const menuToggleCtx = useContext(menuTogglerContext);

  const actionStyle = `flex items-center justify-between w-5/6 2xl:w-4/5 2xl:w-3/4 mx-auto my-3 px-5 py-5 p-4 
                       text-neutral-300 text-base select-none bg-opacity-25 transition 
                       cursor-pointer group active:scale-95 rounded`;

  const notSelectedActionStyle = `${actionStyle} bg-neutral-700 hover:bg-neutral-500 hover:bg-opacity-25`;
  const activeActionStyle = `${actionStyle} bg-neutral-400`;

  const active = (path: string): boolean => {
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
      <Show when={useIsNarrow() !== undefined && useIsNarrow()}>
        <div class='relative text-lg bg-gradient-to-br pt-5 h-[100vh]'>
          <div class='w-5/6 mx-auto'>
            <div class='mb-5 group w-fit mx-auto'>
              <AnchorsModeSelector />
            </div>

            <div class='mx-auto mb-5 h-[30%]'>
              <div class='flex justify-center gap-x-3 my-5'>
                <FollowingSelector />
              </div>

              <RelaySelector />
            </div>

            <A onClick={menuToggleCtx.toggleMobileMenu} href='/write'>
              <div class='flex items-center justify-between px-10 mx-auto rounded bg-slate-700 text-slate-300 py-4 my-1'>
                <FiEdit size={26} class='md:group-hover:animate-pulse' />
                <div class='group-hover:scale-95'>write</div>
              </div>
            </A>

            <A onClick={menuToggleCtx.toggleMobileMenu} href='/favorite-posts'>
              <div class='flex items-center justify-between px-10 mx-auto rounded bg-slate-700 text-slate-300 py-4 my-1'>
                <BsBookmarks size={26} class='md:group-hover:animate-pulse' />
                <div class='group-hover:scale-95'>favorite posts</div>
              </div>
            </A>

            <A onClick={menuToggleCtx.toggleMobileMenu} href='/settings'>
              <div class='flex items-center justify-between px-10 mx-auto rounded bg-slate-700 text-slate-300 py-4 my-1'>
                <IoSettingsOutline size={26} class='md:group-hover:animate-pulse' />
                <div class='group-hover:scale-95'>profile</div>
              </div>
            </A>

            <A
              onClick={menuToggleCtx.toggleMobileMenu}
              href='/what-is-anchors'
              class='absolute top-3 right-3 group'
            >
              <VsInfo
                size={30}
                stroke-width='2'
                class='text-slate-400 group-hover:text-slate-200 group-active:scale-90'
              />
            </A>
          </div>
        </div>
      </Show>

      <Show when={useIsNarrow() !== undefined && !useIsNarrow()}>
        <div class='relative rounded-md text-lg overflow-y-auto bg-neutral-700 h-full pt-10 xl:custom-scrollbar bg-opacity-50'>
          <div class='my-5 group w-fit mx-auto'>
            <AnchorsModeSelector />
          </div>

          <div class='mx-auto 2xl:w-5/6 mt-5 mb-12 px-3'>
            <div class='flex justify-around my-5'>
              <FollowingSelector />
            </div>
          </div>

          <A onClick={menuToggleCtx.toggleMobileMenu} href='/write'>
            <div class={active("/write") ? activeActionStyle : notSelectedActionStyle}>
              <FiEdit size={26} class='md:group-hover:animate-pulse' />
              <div class='group-hover:scale-95'>write</div>
            </div>
          </A>

          <A onClick={menuToggleCtx.toggleMobileMenu} href='/favorite-posts'>
            <div class={active("/favorite-posts") ? activeActionStyle : notSelectedActionStyle}>
              <BsBookmarks size={26} class='md:group-hover:animate-pulse' />
              <div class='group-hover:scale-95'>favorite posts</div>
            </div>
          </A>

          <A onClick={menuToggleCtx.toggleMobileMenu} href='/settings'>
            <div class={active("/settings") ? activeActionStyle : notSelectedActionStyle}>
              <IoSettingsOutline size={26} class='md:group-hover:animate-pulse' />
              <div class='group-hover:scale-95'>profile</div>
            </div>
          </A>

          <A href='/what-is-anchors' class='absolute top-3 right-3 group'>
            <VsInfo
              size={30}
              stroke-width='2'
              class='text-neutral-400 group-hover:text-neutral-200 group-active:scale-90'
            />
          </A>

          <div class='mx-auto xl:w-5/6 mt-5 mb-12 px-3 xl:px-1 h-[30%]'>
            <RelaySelector />
          </div>
        </div>
      </Show>
    </>
  );
};

export default Menu;
