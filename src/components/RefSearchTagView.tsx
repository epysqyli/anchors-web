import { Component, JSX } from "solid-js";
import IRefTag from "~/interfaces/RefTag";
import { FiTrash } from "solid-icons/fi";
import { BiRegularCameraMovie } from "solid-icons/bi";
import { AiOutlineLink, AiOutlineYoutube } from "solid-icons/ai";
import { RiDocumentBook2Line, RiLogosSpotifyLine } from "solid-icons/ri";

interface Props {
  tag: IRefTag;
}

const RefSearchTagView: Component<Props> = (props) => {
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
    <div class="flex items-center justify-between gap-x-5">
      <div class="w-1/6">{icon(props.tag.category)}</div>
      <div class="text break-words w-2/3">{props.tag.value}</div>
      <div class="w-1/6">
        <FiTrash class="mx-auto" />
      </div>
    </div>
  );
};

export default RefSearchTagView;
