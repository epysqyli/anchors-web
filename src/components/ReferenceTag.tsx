import { Component } from "solid-js";

interface Props {
  tag: Array<string>;
}

// each tag needs to be parsed in order to determine what source is being references
// open library urls will lead to having NostrTag showing author, cover, title
// youtube urls will show a thumbnail of the video and the title (maybe more info)
// ...

const ReferenceTag: Component<Props> = (props) => {
  return (
    <div
      class="text-slate-300 break-words mb-3 border-slate-300 border-opacity-25
                rounded-md px-4 py-2 border-2 border-dotted text-base"
    >
      {props.tag[1]}
    </div>
  );
};

export default ReferenceTag;
