import { IoCaretForward } from "solid-icons/io";
import { Component, Show } from "solid-js";

const Menu: Component<{ isNarrow: boolean | undefined }> = (props) => {
  const narrowStyle = `text-lg bg-gradient-to-br from-slate-600 via-slate-700
                       via-20% to-gray-900 to-90% pt-10 h-[100vh]`;

  const wideStyle = `rounded-md text-lg bg-gradient-to-br from-slate-600
                     via-slate-700 via-20% to-gray-900 to-90% relative
                     overflow-y-auto h-full pt-10`;

  return (
    <>
      <Show when={props.isNarrow !== undefined}>
        <div class={props.isNarrow ? narrowStyle : wideStyle}>
          <div
            class="flex items-center gap-x-10 text-slate-50 w-5/6 mx-auto my-2
            hover:bg-slate-600 p-4 rounded-md transition cursor-pointer
            hover:scale-95 active:scale-90"
          >
            <IoCaretForward />
            <div>write</div>
          </div>
          <div
            class="flex items-center gap-x-10 text-slate-50 w-5/6 mx-auto my-2
            hover:bg-slate-600 p-4 rounded-md transition cursor-pointer
            hover:scale-95 active:scale-90"
          >
            <IoCaretForward />
            <div>search posts</div>
          </div>
          <div
            class="flex items-center gap-x-10 text-slate-50 w-5/6 mx-auto my-2
            hover:bg-slate-600 p-4 rounded-md transition cursor-pointer
            hover:scale-95 active:scale-90"
          >
            <IoCaretForward />
            <div>update profile</div>
          </div>
          <div
            class="flex items-center gap-x-10 text-slate-50 w-5/6 mx-auto my-2
            hover:bg-slate-600 p-4 rounded-md transition cursor-pointer
            hover:scale-95 active:scale-90"
          >
            <IoCaretForward />
            <div>manage relays</div>
          </div>
          <div
            class="flex items-center gap-x-10 text-slate-50 w-5/6 mx-auto my-2
            hover:bg-slate-600 p-4 rounded-md transition cursor-pointer
            hover:scale-95 active:scale-90"
          >
            <IoCaretForward />
            <div>manage following</div>
          </div>
          <div
            class="flex items-center gap-x-10 text-slate-50 w-5/6 mx-auto my-2
            hover:bg-slate-600 p-4 rounded-md transition cursor-pointer
            hover:scale-95 active:scale-90"
          >
            <IoCaretForward />
            <div>chats</div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default Menu;
