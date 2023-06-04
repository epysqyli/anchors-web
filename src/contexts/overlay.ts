import { Accessor, createContext, createSignal } from "solid-js";

const [showOverlay, setShowOverlay] = createSignal<boolean>(false);
const toggleOverlay = (): void => {
  setShowOverlay(!showOverlay());
};

interface OverlayInterface {
  showOverlay: Accessor<boolean>;
  toggleOverlay(): void;
}

const overlay = {
  showOverlay: showOverlay,
  toggleOverlay: toggleOverlay,
};

const OverlayContext = createContext<OverlayInterface>(overlay);

export default OverlayContext;
