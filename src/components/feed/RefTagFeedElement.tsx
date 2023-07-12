import { Accessor, Component, JSX, Show } from "solid-js";
import { VsReferences } from "solid-icons/vs";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";
import { FiExternalLink } from "solid-icons/fi";
import RefTagIcon from "../shared/RefTagIcon";

interface Props {
  tag: IFeedRefTag;
  isLoading: Accessor<boolean>;
}

const RefTagFeedElement: Component<Props> = (props) => {
  const preview = (previewUrl: string) => {
    if (previewUrl != "") {
      return <img src={props.tag.preview} loading='lazy' class='rounded mx-auto w-2/5' />;
    }

    return <></>;
  };

  const fallback: JSX.Element = (
    <div class='mb-5 h-1/4 border border-slate-400 border-opacity-25 rounded animate-pulse'>
      <div class='py-5 border-b border-slate-400 border-opacity-25 bg-slate-700 rounded-t'></div>
      <div class='py-10 border-b border-slate-400 border-opacity-25'></div>
      <div class='py-5 '></div>
    </div>
  );

  return (
    <Show when={!props.isLoading()} fallback={fallback}>
      <div class='text-slate-300 bg-slate-700 break-words mb-5 py-1 relative border-x border-orange-200 border-opacity-40'>
        <div class='my-3'>{preview(props.tag.preview)}</div>

        <div class='text-center text-base text-slate-300 py-3 px-5'>
          {props.tag.primaryInfo == "" ? props.tag.url : props.tag.primaryInfo}
        </div>

        <div class='flex items-center justify-between py-3'>
          <div class='w-1/3'>
            <RefTagIcon category={props.tag.category} />
          </div>
          <a class='w-1/3 cursor-pointer' href={props.tag.url} target='_blank'>
            <FiExternalLink
              size={28}
              class='mx-auto text-slate-400 hover:scale-110 active:scale-95 transition'
            />
          </a>
          <div class='w-1/3'>
            <VsReferences
              size={28}
              class='mx-auto cursor-pointer text-slate-400 hover:scale-110 active:scale-95 transition'
            />
          </div>
        </div>
      </div>
    </Show>
  );
};

export default RefTagFeedElement;
