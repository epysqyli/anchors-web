import { VsClose } from "solid-icons/vs";
import { Component, JSX } from "solid-js";
import { BiRegularCameraMovie } from "solid-icons/bi";
import { AiOutlineYoutube } from "solid-icons/ai";
import { RiDocumentBook2Line, RiLogosSpotifyLine } from "solid-icons/ri";
import { IRefTag } from "~/interfaces/IRefTag";
import { FiLink } from "solid-icons/fi";

interface Props {
  tag: IRefTag;
  removeTag(tag: IRefTag): void;
}

const RefTagElement: Component<Props> = (props) => {
  const icon = (category: string): JSX.Element => {
    switch (category) {
      case "generic":
        return <FiLink size={22} class='mx-auto' />;

      case "book":
        return <RiDocumentBook2Line size={22} class='mx-auto' />;

      case "video":
        return <AiOutlineYoutube size={22} class='mx-auto' />;

      case "movie":
        return <BiRegularCameraMovie size={22} class='mx-auto' />;

      case "song":
        return <RiLogosSpotifyLine size={22} class='mx-auto' />;
    }
  };

  return (
    <div
      class='flex items-center justify-between gap-x-5 py-2
               bg-slate-600 rounded text-slate-100 border border-orange-300'
    >
      <div class='w-1/6'>{icon(props.tag.category)}</div>
      <div class='text break-all w-2/3 py-2'>
        <div>{props.tag.title}</div>
        <div class='text-slate-400 text-sm'>{props.tag.additionalInfoOne}</div>
      </div>
      <div
        class='w-1/6 cursor-pointer hover:scale-90 transition active:bg-orange-200
              hover:bg-orange-100 hover:text-slate-600 rounded py-2 mr-1'
        onClick={() => props.removeTag(props.tag)}
      >
        <VsClose size={20} class='mx-auto' />
      </div>
    </div>
  );
};

export default RefTagElement;
