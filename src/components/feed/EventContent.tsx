import { Component, JSX } from "solid-js";

const EventContent: Component<{ content: string }> = (props): JSX.Element => {
  return (
    <div class='col-span-4 xl:col-span-4 bg-neutral-900 bg-opacity-30 rounded-md h-full overflow-y-hidden py-10'>
      <p
        class='w-5/6 px-5 mx-auto text-slate-300 tracking-tighter break-words
               whitespace-pre-line overflow-y-scroll xl:custom-scrollbar h-full'
      >
        {props.content}
      </p>
    </div>
  );
};

export default EventContent;
