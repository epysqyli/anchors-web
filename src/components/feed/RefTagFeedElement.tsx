import { Accessor, Component, JSX, Show } from "solid-js";
import { VsReferences } from "solid-icons/vs";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";
import { FiExternalLink } from "solid-icons/fi";
import refTagIcon from "~/lib/ref-tags/refTagIcon";

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
      <div class='text-slate-300 break-words mb-5 border border-slate-400 rounded border-opacity-25'>
        <div class='border-b bg-slate-700 rounded-t border-opacity-25 border-slate-400 py-3'>
          {refTagIcon(props.tag.category)}
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
    </Show>
  );
};

export default RefTagFeedElement;
