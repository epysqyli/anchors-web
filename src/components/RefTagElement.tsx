import { VsClose } from "solid-icons/vs";
import { Component, JSX } from "solid-js";
import IRefTag from "~/interfaces/IRefTag";
import { BiRegularCameraMovie } from "solid-icons/bi";
import { AiOutlineLink, AiOutlineYoutube } from "solid-icons/ai";
import { RiDocumentBook2Line, RiLogosSpotifyLine } from "solid-icons/ri";

interface Props {
  tag: IRefTag;
  removeTag(tag: IRefTag): void;
}

const RefTagElement: Component<Props> = (props) => {
  const icon = (category: string): JSX.Element => {
    switch (category) {
      case "generic":
        return <AiOutlineLink size={22} class="mx-auto" />;

      case "book":
        return <RiDocumentBook2Line size={22} class="mx-auto" />;

      case "video":
        return <AiOutlineYoutube size={22} class="mx-auto" />;

      case "movie":
        return <BiRegularCameraMovie size={22} class="mx-auto" />;

      case "song":
        return <RiLogosSpotifyLine size={22} class="mx-auto" />;
    }
  };

  return (
    <div class="flex items-center justify-between gap-x-5 bg-slate-600 rounded">
      <div class="w-1/6">{icon(props.tag.category)}</div>
      <div class="text break-words w-2/3">{props.tag.value}</div>
      <div
        class="w-1/6 cursor-pointer hover:scale-90 transition active:bg-orange-200
              hover:bg-orange-100 hover:text-slate-600 rounded py-2 mr-1"
        onClick={() => props.removeTag(props.tag)}
      >
        <VsClose size={20} class="mx-auto" />
      </div>
    </div>
  );
};

export default RefTagElement;
