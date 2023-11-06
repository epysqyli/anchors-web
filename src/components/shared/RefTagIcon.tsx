import { FiLink, FiYoutube } from "solid-icons/fi";
import { RiDocumentBook2Line, RiLogosSpotifyLine, RiMediaMovie2Line } from "solid-icons/ri";
import { Component, JSX } from "solid-js";

// TODO: make into a component?
const RefTagIcon: Component<{ category: string }> = (props): JSX.Element => {
  switch (props.category) {
    case "generic":
      return <FiLink size={30} class='mx-auto' />;

    case "book":
      return <RiDocumentBook2Line size={32} class='mx-auto text-amber-300' />;

    case "video":
      return <FiYoutube size={32} class='mx-auto text-red-500' stroke-width={1.5} />;

    case "movie":
      return <RiMediaMovie2Line size={32} class='mx-auto text-blue-400' />;

    case "song":
      return <RiLogosSpotifyLine size={32} class='mx-auto text-green-500' />;
  }
};

export default RefTagIcon;
