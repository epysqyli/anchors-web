import { A } from "@solidjs/router";
import { Component, JSX } from "solid-js";

interface Props {
  href: string;
  content: string;
  children?: JSX.Element;
}

const SettingsLink: Component<Props> = (props): JSX.Element => {
  return (
    <A
      href={props.href}
      class='group text-slate-200 py-4 md:py-8 bg-slate-600 bg-opacity-70 rounded-md border-neutral-600 text-lg'
    >
      <div class='mb-5 md:mb-10 mx-auto text-slate-300 group-hover:text-slate-50 group-active:scale-95'>
        {props.children}
      </div>
      <div class='text-center text-base w-4/5 mx-auto'>{props.content}</div>
    </A>
  );
};

export default SettingsLink;
