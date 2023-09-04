import { Component } from "solid-js";
import { FiChevronDown, FiChevronUp } from "solid-icons/fi";

interface Props {
  scrollPage?(direction: "up" | "down"): void;
}

const EventScroller: Component<Props> = (props) => {
  if (props.scrollPage == undefined) {
    return <></>;
  }

  return (
    <div class='text-slate-400'>
      <div
        onClick={() => props.scrollPage!("up")}
        class='cursor-pointer hover:scale-105 hover:text-slate-200 active:scale-90'
      >
        <FiChevronUp size={40} />
      </div>
      <div
        onClick={() => props.scrollPage!("down")}
        class='cursor-pointer hover:scale-105 hover:text-slate-200 active:scale-90'
      >
        <FiChevronDown size={40} />
      </div>
    </div>
  );
};

export default EventScroller;
