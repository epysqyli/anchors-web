import { Component, JSX } from "solid-js";
import { VsReferences } from "solid-icons/vs";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";
import { FiLink, FiYoutube, FiExternalLink } from "solid-icons/fi";
import { RiDocumentBook2Line, RiLogosSpotifyLine, RiMediaMovie2Line } from "solid-icons/ri";

interface Props {
  tag: IFeedRefTag;
}

const RefTagFeedElement: Component<Props> = (props) => {
  const icon = (category: string): JSX.Element => {
    switch (category) {
      case "generic":
        return <FiLink size={38} class='mx-auto' />;

      case "book":
        return <RiDocumentBook2Line size={38} class='mx-auto text-amber-300' />;

      case "video":
        return <FiYoutube size={38} class='mx-auto text-red-500' stroke-width={1.5} />;

      case "movie":
        return <RiMediaMovie2Line size={38} class='mx-auto text-blue-400' />;

      case "song":
        return <RiLogosSpotifyLine size={38} class='mx-auto text-green-500' />;
    }
  };

  const preview = (previewUrl: string) => {
    if (previewUrl != "") {
      return <img src={props.tag.preview} loading='lazy' class='rounded mx-auto w-2/5' />;
    }

    return <></>;
  };

  return (
    <div class='text-slate-300 break-words mb-5 border border-slate-400 rounded border-opacity-25'>
      <div class='border-b bg-slate-700 rounded-t border-opacity-25 border-slate-400 py-3'>
        {icon(props.tag.category)}
      </div>
      <div class='my-3'>{preview(props.tag.preview)}</div>

      <div class='text-center text-base text-slate-300 py-3 border-b border-slate-400 border-opacity-25 px-5'>
        {props.tag.primaryInfo == "" ? props.tag.url : props.tag.primaryInfo}
      </div>

      <div class='flex items-center justify-between py-3'>
        <a class='w-1/2 cursor-pointer' href={props.tag.url} target='_blank'>
          <FiExternalLink
            size={28}
            class='mx-auto text-slate-400 hover:scale-110 active:scale-95 transition'
          />
        </a>
        <div class='w-1/2'>
          <VsReferences
            size={28}
            class='mx-auto cursor-pointer text-slate-400 hover:scale-110 active:scale-95 transition'
          />
        </div>
      </div>
    </div>
  );
};

export default RefTagFeedElement;
