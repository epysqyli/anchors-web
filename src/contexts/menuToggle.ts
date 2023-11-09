import { Accessor, createContext, createSignal } from "solid-js";

const [showMobileMenu, setShowMobileMenu] = createSignal<boolean>(false);
const toggleMobileMenu = (): void => {
  setShowMobileMenu(!showMobileMenu());
};

const [showMenuButton, setShowMenuButton] = createSignal<boolean>(true);
const toggleMenuButton = (): void => {
  setShowMenuButton(!showMenuButton());
};

interface MenuTogglerInterface {
  showMobileMenu: Accessor<boolean>;
  showMenuButton: Accessor<boolean>;
  toggleMobileMenu(): void;
  toggleMenuButton(): void;
}

const menuToggler: MenuTogglerInterface = {
  showMobileMenu: showMobileMenu,
  showMenuButton: showMenuButton,
  toggleMenuButton: toggleMenuButton,
  toggleMobileMenu: toggleMobileMenu
};

const menuTogglerContext = createContext<MenuTogglerInterface>(menuToggler);
export default menuTogglerContext;
