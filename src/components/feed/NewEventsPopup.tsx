import { Motion, Presence } from "@motionone/solid";
import { HiOutlineNewspaper } from "solid-icons/hi";
import { Accessor, Component, Setter, Show } from "solid-js";

interface Props {
  topEventRef: Accessor<HTMLDivElement | undefined>;
  showPopup: Accessor<boolean>;
  setShowPopup: Setter<boolean>;
}

const NewEventsPopup: Component<Props> = (props) => {
  const handleClick = (): void => {
    props.topEventRef()?.scrollIntoView({ behavior: "smooth" });
    props.setShowPopup(false);
  };

  return (
    <Presence>
      <Show when={props.showPopup()}>
        <Motion.div
          animate={{ opacity: [0.5, 0.9, 1], scale: [0.5, 1.05, 1] }}
          exit={{ scale: [1.05, 1, 0], opacity: [1, 0.9, 0.5] }}
          onClick={handleClick}
          class='bg-slate-500 text-slate-100 p-5 cursor-pointer rounded-full animate-pulse'
        >
          <HiOutlineNewspaper size={28} color='white' />
        </Motion.div>
      </Show>
    </Presence>
  );
};

export default NewEventsPopup;
