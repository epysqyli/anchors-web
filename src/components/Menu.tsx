import { FiAnchor } from "solid-icons/fi";
import { Component, Show } from "solid-js";

const Menu: Component<{ isNarrow: boolean | undefined }> = (props) => {
  const narrowStyle = `text-lg bg-gradient-to-br from-slate-600 via-slate-700
                       via-20% to-gray-900 to-90% pt-10 h-[100vh]`;

  const wideStyle = `rounded-md text-lg bg-gradient-to-br from-slate-600
                     via-slate-700 via-20% to-gray-900 to-90% relative
                     overflow-y-auto h-full pt-10`;

  const actionStyle = `text-slate-50 w-5/6 mx-auto my-2 select-none
                       bg-gradient-to-r from-slate-800 to-gray-700
                       hover:bg-slate-600 p-4 rounded-md text-center lg:text-left
                       transition cursor-pointer hover:scale-95 active:scale-90`;

  return (
    <>
      <Show when={props.isNarrow !== undefined}>
        <div class={props.isNarrow ? narrowStyle : wideStyle}>
          <div class="text-slate-100 w-fit mx-auto my-10 ">
            <FiAnchor size={40} />
          </div>
          <div class={actionStyle}>
            <div>feed</div>
          </div>
          <div class={actionStyle}>
            <div>write</div>
          </div>
          <div class={actionStyle}>
            <div>search</div>
          </div>
          <div class={actionStyle}>
            <div>chats</div>
          </div>
          <div class={actionStyle}>
            <div>settings</div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default Menu;
