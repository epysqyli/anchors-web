import { CgDanger } from "solid-icons/cg";
import { RiSystemCheckboxCircleFill } from "solid-icons/ri";
import { Motion, Presence } from "@motionone/solid";
import { Accessor, Component, Show } from "solid-js";
import { RiSystemCloseCircleFill } from "solid-icons/ri";

interface Props {
  isActionSuccessful: Accessor<boolean>;
  message: Accessor<string>;
  show: Accessor<boolean>;
  togglePopup(): void;
}

const ActionPopup: Component<Props> = (props) => {
  return (
    <Presence exitBeforeEnter>
      <Show when={props.show()}>
        <Motion.div
          animate={{
            opacity: [0.5, 0.9, 1],
            scale: [0.4, 1.05, 1],
            transition: { duration: 0.3, easing: "ease-out" }
          }}
          exit={{
            opacity: [1, 0.9, 0.5],
            scale: [1, 1.05, 0.1],
            transition: {
              duration: 0.2,
              easing: "ease-out"
            }
          }}
          transition={{ easing: "ease-out", duration: 0.2 }}
          class='relative tracking-tight py-12 px-14 bg-neutral-700 rounded-md text-lg shadow-md'
        >
          <div class='w-fit mx-auto text-slate-100 mb-5'>
            {props.isActionSuccessful() ? <RiSystemCheckboxCircleFill size={44} /> : <CgDanger size={44} />}
          </div>
          <p class='text-center leading-8 text-slate-200 px-10 mx-auto'>{props.message()}</p>
          <div onClick={props.togglePopup} class='absolute -top-2 -right-2 text-slate-100 cursor-pointer'>
            <RiSystemCloseCircleFill size={28} />
          </div>
        </Motion.div>
      </Show>
    </Presence>
  );
};

export default ActionPopup;
