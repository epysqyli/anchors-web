import { Accessor, createContext, createSignal } from "solid-js";

const [showMenuButton, setShowMenuButton] = createSignal<boolean>(true);
const toggleMenu = (): void => {
  setShowMenuButton(!showMenuButton());
};

interface MenuTogglerInterface {
  showMenuButton: Accessor<boolean>;
  toggleMenu(): void;
}

const menuToggler: MenuTogglerInterface = {
  showMenuButton: showMenuButton,
  toggleMenu: toggleMenu
};

const menuTogglerContext = createContext<MenuTogglerInterface>(menuToggler);
export default menuTogglerContext;
