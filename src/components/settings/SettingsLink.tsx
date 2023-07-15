import { A } from "@solidjs/router";
import { Component, JSX } from "solid-js";
import { VsLinkExternal } from "solid-icons/vs";

interface Props {
  href: string;
  content: string;
  children?: JSX.Element;
}

const SettingsLink: Component<Props> = (props): JSX.Element => {
  return (
    <A href={props.href}>
      <div class='h-full text-slate-200 group bg-neutral-600 rounded border-neutral-600 text-lg'>
        <div class='flex items-center justify-center h-3/4'>
          <div class='grow text-slate-300'>{props.children}</div>

          <div class='self-start p-5 mx-auto group-hover:text-slate-200 transition-all text-slate-400'>
            <VsLinkExternal size={24} />
          </div>
        </div>
        <div class='h-1/4 text-center bg-neutral-700 py-3 group-active:bg-neutral-800'>{props.content}</div>
      </div>
    </A>
  );
};

export default SettingsLink;
