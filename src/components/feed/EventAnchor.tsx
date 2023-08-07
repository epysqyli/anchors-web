import { A } from "@solidjs/router";
import { Component, JSX } from "solid-js";
import { useLocation } from "solid-start";

interface Props {
  nostrEventID: string;
}

const EventAnchor: Component<Props> = (props): JSX.Element => {
  const anchorNostrIDstyle = (): string => {
    if (useLocation().pathname.includes(props.nostrEventID)) {
      return "text-sm break-all w-1/5 text-slate-400 bg-slate-600 px-2 py-1 rounded cursor-default";
    }

    return `text-sm break-all w-1/5 text-slate-400 cursor-pointer bg-slate-600
            px-2 py-1 rounded hover:text-slate-200 active:scale-95 transition-all`;
  };

  return (
    <A class={anchorNostrIDstyle()} href={`/events/${props.nostrEventID}`}>
      {props.nostrEventID}
    </A>
  );
};

export default EventAnchor;
