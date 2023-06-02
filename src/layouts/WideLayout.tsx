import Menu from "~/components/Menu";
import { Component, JSX } from "solid-js";

interface Props {
  children: JSX.Element;
  toggleMenu: () => void;
}

const WideLayout: Component<Props> = (props) => {
  return (
    <div class="h-screen flex gap-x-3 px-2 2xl:gap-x-4 2xl:px-5 justify-center items-center">
      <div class="h-[96vh] w-1/5">
        <Menu isNarrow={false} toggleMenu={props.toggleMenu} />
      </div>

      <div
        class="h-[96vh] w-4/5 rounded-md bg-gradient-to-bl from-slate-700
           via-slate-700 via-20% to-gray-800 to-80%"
      >
        {props.children}
      </div>
    </div>
  );
};

export default WideLayout;
