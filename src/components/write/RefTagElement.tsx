import { FiTrash2 } from "solid-icons/fi";
import { Component } from "solid-js";
import { IRefTag } from "~/interfaces/IRefTag";
import RefTagIcon from "../shared/RefTagIcon";

interface Props {
  tag: IRefTag;
  removeTag(tag: IRefTag): void;
}

const RefTagElement: Component<Props> = (props) => {
  return (
    <div class='flex items-center px-2 justify-between bg-slate-700 text-slate-100 border-x border-orange-300'>
      <div class='p-3 rounded-xl'>
        <RefTagIcon category={props.tag.category} />
      </div>
      <div class='text break-all w-2/3 px-3 py-6'>
        <div>{props.tag.title}</div>
        <div class='text-slate-400 text-sm'>{props.tag.additionalInfoOne}</div>
      </div>
      <div
        class='p-3 rounded-xl cursor-pointer hover:scale-105 transition hover:text-red-300 active:scale-90'
        onClick={() => props.removeTag(props.tag)}
      >
        <FiTrash2 size={28} class='mx-auto' stroke-width={1} />
      </div>
    </div>
  );
};

export default RefTagElement;
