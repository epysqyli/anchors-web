import { A } from "@solidjs/router";
import { Component, JSX } from "solid-js";

interface Props {
  href: string;
  content: string;
  children?: JSX.Element;
}

const SettingsLink: Component<Props> = (props): JSX.Element => {
  return (
    <A href={props.href}>
      <div class='h-full group text-slate-200 group bg-slate-600 bg-opacity-70 rounded-md border-neutral-600 text-lg'>
        <div class='h-3/5 py-10 mx-auto text-slate-300 group-hover:text-slate-50'>{props.children}</div>
        <div class='h-2/5 text-center bg-neutral-600 group-active:bg-neutral-800 relative'>
          <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>{props.content}</div>
        </div>
      </div>
    </A>
  );
};

export default SettingsLink;
