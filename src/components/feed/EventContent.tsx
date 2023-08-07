import { Component, JSX } from "solid-js";

const EventContent: Component<{ content: string }> = (props): JSX.Element => {
  return (
    <div
      class='col-span-4 xl:col-span-3 custom-scrollbar bg-slate-600 bg-opacity-10
         text-slate-300 tracking-tighter overflow-auto break-words text-justify
          whitespace-pre-line rounded-md py-20'
    >
      <p class='w-3/5 mx-auto'>{props.content}</p>
    </div>
  );
};

export default EventContent;
