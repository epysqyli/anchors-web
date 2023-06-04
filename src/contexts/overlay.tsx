import { Accessor, JSX, createContext, createSignal } from "solid-js";

const [showOverlay, setShowOverlay] = createSignal<boolean>(false);
const toggleOverlay = (): void => {
  setShowOverlay(!showOverlay());
};

const overlayDiv = (
  <div class="absolute bg-slate-900 h-full w-full top-0 left-0 bg-opacity-60 z-0"></div>
);

interface OverlayInterface {
  showOverlay: Accessor<boolean>;
  toggleOverlay(): void;
  div: JSX.Element;
}

const overlay = {
  showOverlay: showOverlay,
  toggleOverlay: toggleOverlay,
  div: overlayDiv,
};

const OverlayContext = createContext<OverlayInterface>(overlay);

export default OverlayContext;
