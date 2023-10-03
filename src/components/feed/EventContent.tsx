import { Component, JSX } from "solid-js";

const EventContent: Component<{ content: string }> = (props): JSX.Element => {
  return (
    <div
      class='col-span-4 xl:col-span-4 custom-scrollbar bg-neutral-900 bg-opacity-30
         text-slate-300 tracking-tighter overflow-auto break-words text-justify
          whitespace-pre-line rounded-md py-20'
    >
      <p class='w-3/5 mx-auto'>{props.content}</p>
    </div>
  );
};

export default EventContent;
