import { Component, onMount } from "solid-js";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";

interface Props {
  tag: IFeedRefTag;
}

const RefTagFeedElement: Component<Props> = (props) => {
  return (
    <div class='text-slate-300 break-words mb-3 border-slate-300 border-opacity-25 rounded-md px-4 py-2 border-2 border-dotted text-base'>
      <p>{props.tag.url}</p>
      <p class='mt-2'>{props.tag.preview}</p>
      <p class='mt-2'>{props.tag.primaryInfo}</p>
    </div>
  );
};

export default RefTagFeedElement;
