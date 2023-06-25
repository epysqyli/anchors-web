import { FiTrash2 } from "solid-icons/fi";
import { Component, JSX } from "solid-js";
import { IRefTag } from "~/interfaces/IRefTag";
import { FiLink, FiYoutube } from "solid-icons/fi";
import { BiRegularCameraMovie } from "solid-icons/bi";
import { RiDocumentBook2Line, RiLogosSpotifyLine } from "solid-icons/ri";

interface Props {
  tag: IRefTag;
  removeTag(tag: IRefTag): void;
}

const RefTagElement: Component<Props> = (props) => {
  const icon = (category: string): JSX.Element => {
    switch (category) {
      case "generic":
        return <FiLink size={32} class='mx-auto' />;

      case "book":
        return <RiDocumentBook2Line size={32} class='mx-auto text-amber-300' />;

      case "video":
        return <FiYoutube size={32} class='mx-auto text-red-500' stroke-width={1.5} />;

      case "movie":
        return <BiRegularCameraMovie size={32} class='mx-auto' />;

      case "song":
        return <RiLogosSpotifyLine size={32} class='mx-auto text-green-500' />;
    }
  };

  return (
    <div class='flex items-center px-2 justify-between bg-slate-600 rounded text-slate-100 border border-orange-300'>
      <div class='p-3 rounded-xl'>{icon(props.tag.category)}</div>
      <div class='text break-all w-2/3 px-3 py-6 border-r border-slate-400'>
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
