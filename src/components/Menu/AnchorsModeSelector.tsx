import { Motion } from "@motionone/solid";
import { BsGlobe2 } from "solid-icons/bs";
import { FiAnchor } from "solid-icons/fi";
import { JSX, VoidComponent, useContext } from "solid-js";
import { RelayContext } from "~/contexts/relay";

const AnchorsModeSelector: VoidComponent = (): JSX.Element => {
  const { isAnchorsMode, setIsAnchorsMode } = useContext(RelayContext);

  const toggleAnchorsMode = (): void => {
    setIsAnchorsMode(!isAnchorsMode());
  };

  return (
    <>
      <div
        onClick={toggleAnchorsMode}
        class='text-slate-100 w-fit mx-auto cursor-pointer transition
                   border-2 border-dashed border-neutral-500 hover:bg-neutral-500
                   hover:border-neutral-600 rounded-full p-3 active:bg-neutral-700'
      >
        {isAnchorsMode() ? (
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
        class='mt-3 rounded px-2 py-1 text-sm bg-transparent text-transparent select-none
                      group-hover:text-neutral-300 group-hover:bg-neutral-600 transition'
      >
        switch to {isAnchorsMode() ? "all nostr" : "only anchors"} posts
      </div>
    </>
  );
};

export default AnchorsModeSelector;
