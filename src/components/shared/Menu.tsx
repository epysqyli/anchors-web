import { A } from "@solidjs/router";
import { FiEdit } from "solid-icons/fi";
import { useLocation } from "solid-start";
import RelaySelector from "../menu/RelaySelector";
import { IoSettingsOutline } from "solid-icons/io";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import menuTogglerContext from "~/contexts/menuToggle";
import FollowingSelector from "../menu/FollowingSelector";
import AnchorsModeSelector from "../menu/AnchorsModeSelector";
import { JSX, Show, VoidComponent, useContext } from "solid-js";
import { BsBookmarks } from "solid-icons/bs";

const Menu: VoidComponent = (): JSX.Element => {
  const location = useLocation();

  const menuToggleCtx = useContext(menuTogglerContext);

  const actionStyle = `text-neutral-300 w-5/6 2xl:w-4/5 2xl:w-3/4 mx-auto my-3 select-none
                       md:bg-neutral-700 md:bg-opacity-25 md:px-5 md:py-5 p-4 transition cursor-pointer 
                       group active:scale-90 hover:bg-neutral-700 rounded`;

  const flexActionStyle = actionStyle + " flex items-center justify-between";
  const selectedFlexActionStyle = flexActionStyle + " md:border-orange-200 md:bg-neutral-500";

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
        <div class='text-lg bg-gradient-to-br pt-5 h-[100vh]'>
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
              <div class='flex items-center justify-between px-10 mx-auto rounded bg-slate-700 text-slate-300 py-3 my-1'>
                <div class='group-hover:scale-95'>write</div>
                <FiEdit size={26} class='md:group-hover:animate-pulse' />
              </div>
            </A>

            <A onClick={menuToggleCtx.toggleMobileMenu} href='/favorite-posts'>
              <div class='flex items-center justify-between px-10 mx-auto rounded bg-slate-700 text-slate-300 py-3 my-1'>
                <div class='group-hover:scale-95'>favorite posts</div>
                <BsBookmarks size={26} class='md:group-hover:animate-pulse' />
              </div>
            </A>

            {/* <A onClick={menuToggleCtx.toggleMobileMenu} href='/search'>
              <div class='flex items-center justify-between px-10 mx-auto rounded bg-slate-700 text-slate-300 py-3 my-1'>
                <div class='group-hover:scale-95'>search</div>
                <BsSearch size={26} class='md:group-hover:animate-pulse' />
              </div>
            </A> */}

            <A onClick={menuToggleCtx.toggleMobileMenu} href='/settings'>
              <div class='flex items-center justify-between px-10 mx-auto rounded bg-slate-700 text-slate-300 py-3 my-1'>
                <div class='group-hover:scale-95'>profile</div>
                <IoSettingsOutline size={26} class='md:group-hover:animate-pulse' />
              </div>
            </A>
          </div>
        </div>
      </Show>

      <Show when={useIsNarrow() !== undefined && !useIsNarrow()}>
        <div class='rounded-md text-lg relative overflow-y-auto bg-neutral-700 bg-opacity-50 h-full pt-10 xl:custom-scrollbar'>
          <div class='my-5 group w-fit mx-auto'>
            <AnchorsModeSelector />
          </div>

          <div class='mx-auto 2xl:w-5/6 mt-5 mb-12 px-3 h-[30%]'>
            <div class='flex justify-around my-5'>
              <FollowingSelector />
            </div>
            <RelaySelector />
          </div>

          <A onClick={menuToggleCtx.toggleMobileMenu} href='/write'>
            <div class={active("/write") ? selectedFlexActionStyle : flexActionStyle}>
              <div class='group-hover:scale-95'>write</div>
              <FiEdit size={26} class='md:group-hover:animate-pulse' />
            </div>
          </A>

          <A onClick={menuToggleCtx.toggleMobileMenu} href='/favorite-posts'>
            <div class={active("/favorite-posts") ? selectedFlexActionStyle : flexActionStyle}>
              <div class='group-hover:scale-95'>favorite posts</div>
              <BsBookmarks size={26} class='md:group-hover:animate-pulse' />
            </div>
          </A>

          {/* <A onClick={menuToggleCtx.toggleMobileMenu} href='/search'>
            <div class={active("/search") ? selectedFlexActionStyle : flexActionStyle}>
              <div class='group-hover:scale-95'>search</div>
              <BsSearch size={26} class='md:group-hover:animate-pulse' />
            </div>
          </A> */}

          <A onClick={menuToggleCtx.toggleMobileMenu} href='/settings'>
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
