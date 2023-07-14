import { A } from "@solidjs/router";
import { Component, JSX } from "solid-js";
import { VsLinkExternal } from "solid-icons/vs";

interface Props {
  href: string;
  content: string;
}

const SettingsLink: Component<Props> = (props): JSX.Element => {
  return (
    <A href={props.href}>
      <div class='h-full text-slate-200 group border-x border-neutral-600 text-lg'>
        <div class='h-3/4 w-fit p-6 group-hover:scale-105 transition-all ml-auto text-slate-300'>
          <VsLinkExternal size={30} />
        </div>
        <div class='h-1/4 text-center bg-neutral-700 py-3 group-active:bg-neutral-800'>{props.content}</div>
      </div>
    </A>
  );
};

export default SettingsLink;
