import { Motion } from "@motionone/solid";
import { ImFeed } from "solid-icons/im";
import { Accessor, Component, Setter } from "solid-js";

interface Props {
  topEventRef: Accessor<HTMLDivElement | undefined>;
  setShowPopup: Setter<boolean>;
}

const NewEventsPopup: Component<Props> = (props) => {
  const handleClick = (): void => {
    props.topEventRef()?.scrollIntoView({ behavior: "smooth" });
    props.setShowPopup(false);
  };

  return (
    <Motion.div
      animate={{ opacity: [0.5, 0.9, 1], scale: [0.5, 1.05, 1] }}
      onClick={handleClick}
      class=' bg-slate-500 p-3 cursor-pointer rounded-full animate-pulse'
    >
      <ImFeed size={22} />
    </Motion.div>
  );
};

export default NewEventsPopup;
