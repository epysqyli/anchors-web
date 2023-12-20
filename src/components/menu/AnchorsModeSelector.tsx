import { Motion } from "@motionone/solid";
import { BsGlobe2 } from "solid-icons/bs";
import { FiAnchor } from "solid-icons/fi";
import { RelayContext } from "~/contexts/relay";
import { JSX, VoidComponent, createSignal, useContext } from "solid-js";

const AnchorsModeSelector: VoidComponent = (): JSX.Element => {
  const { anchorsMode } = useContext(RelayContext);

  const toggleAnchorsMode = (): void => {
    toggleSwitchMsg();
    anchorsMode.set(!anchorsMode.get());
  };

  const [showSwitchMsg, setShowSwitchMsg] = createSignal<boolean>(false);
  const toggleSwitchMsg = (): void => {
    setShowSwitchMsg(!showSwitchMsg());
  };

  return (
    <>
      <div
        onClick={toggleAnchorsMode}
        onMouseEnter={toggleSwitchMsg}
        onMouseLeave={toggleSwitchMsg}
        class='text-slate-100 w-fit mx-auto cursor-pointer transition
                   border-2 md:border-neutral-600 active:bg-slate-500 md:hover:bg-neutral-500
                   hover:border-neutral-700 rounded-full p-3 md:active:bg-neutral-700'
      >
        {anchorsMode.get() ? (
          <Motion.div animate={{ scale: [0.7, 1] }}>
            <FiAnchor size={40} />
          </Motion.div>
        ) : (
          <Motion.div animate={{ scale: [0.7, 1] }}>
            <BsGlobe2 size={40} />
          </Motion.div>
        )}
      </div>

      <div
        class='mt-5 rounded px-2 py-1 text-sm select-none text-neutral-400 bg-slate-600
                 md:bg-neutral-600 bg-opacity-40 transition'
      >
        {showSwitchMsg() ? (
          <span>switch to {anchorsMode.get() ? "all nostr" : "only anchors"} posts</span>
        ) : (
          <span class=''>showing {anchorsMode.get() ? "anchors" : "all"} posts</span>
        )}
      </div>
    </>
  );
};

export default AnchorsModeSelector;
