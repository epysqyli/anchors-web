import { A } from "solid-start";
import { VsReferences } from "solid-icons/vs";
import RefTagIcon from "../shared/RefTagIcon";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";
import { FiEdit, FiExternalLink } from "solid-icons/fi";
import { Accessor, Component, JSX, Show } from "solid-js";

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

  const anchorTagOnHoverTitle = (title: string): JSX.Element => {
    return (
      <span
        class='hidden group-hover:block absolute text-xs -top-12 left-1/2 -translate-x-1/2
               bg-slate-600 rounded-md px-5 py-2 w-48 text-center shadow-md'
      >
        {title}
      </span>
    );
  };

  return (
    <Show when={!props.isLoading()} fallback={fallback}>
      <div class='text-slate-300 bg-slate-700 break-words mb-5 py-1 relative border-x border-orange-200 border-opacity-40'>
        <div class='my-3'>{preview(props.tag.preview)}</div>

        <div class='text-center text-base text-slate-300 py-3 px-5'>
          {props.tag.primaryInfo == "" ? props.tag.url : props.tag.primaryInfo}
        </div>

        <div class='flex items-center justify-between py-3'>
          <div class='w-1/4'>
            <RefTagIcon category={props.tag.category} />
          </div>

          <A class='w-1/4 cursor-pointer group relative' href={props.tag.url} target='_blank'>
            <FiExternalLink
              size={28}
              class='mx-auto text-slate-400 hover:scale-110 active:scale-95 transition'
            />

            {anchorTagOnHoverTitle("navigate to external resource link")}
          </A>

          <A href={`/refs/${encodeURIComponent(props.tag.url)}`} class='w-1/4 group relative'>
            <VsReferences
              size={28}
              class='mx-auto cursor-pointer text-slate-400 hover:scale-110 active:scale-95 transition'
            />

            {anchorTagOnHoverTitle("explore other posts using the same reference")}
          </A>

          <A
            href={`/write?preview=${encodeURIComponent(props.tag.preview)}&url=${encodeURIComponent(
              props.tag.url
            )}&primaryInfo=${encodeURIComponent(props.tag.primaryInfo)}&category=${props.tag.category}`}
            class='w-1/4 data-[title]:hover:text-slate-300 group relative'
          >
            <FiEdit
              size={28}
              stroke-width={1.5}
              class='mx-auto cursor-pointer text-slate-400 hover:scale-110 active:scale-95 transition'
            />

            {anchorTagOnHoverTitle("write a post with the same reference")}
          </A>
        </div>
      </div>
    </Show>
  );
};

export default RefTagFeedElement;
