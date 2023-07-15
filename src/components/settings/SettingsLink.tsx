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
      <div class='h-full group text-slate-200 group bg-neutral-600 rounded border-neutral-600 text-lg'>
        <div class='h-3/4 py-10 mx-auto text-slate-300 group-hover:text-orange-200'>{props.children}</div>
        <div class='h-1/4 text-center bg-neutral-700 py-3 group-active:bg-neutral-800'>{props.content}</div>
      </div>
    </A>
  );
};

export default SettingsLink;
