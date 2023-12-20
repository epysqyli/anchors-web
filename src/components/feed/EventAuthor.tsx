import { Component, createSignal } from "solid-js";
import { RiUserFacesAccountCircleFill } from "solid-icons/ri";
import { IUserMetadata } from "~/interfaces/IUserMetadata";

const EventAuthor: Component<IUserMetadata & { pubKey: string; layout: "h" | "v" }> = (props) => {
  const [imageSrcFails, setImageSrcFails] = createSignal<boolean>(false);

  const containerStyle =
    props.layout == "v" ? "rounded-md" : "flex justify-center items-center gap-x-2 md:gap-x-5 rounded-md";
  const imgStyle = props.layout == "v" ? "mx-auto mb-3 rounded-full h-12" : "h-8 rounded-full";

  return (
    <>
      <div class={containerStyle}>
        {imageSrcFails() ? (
          <RiUserFacesAccountCircleFill size={36} class={imgStyle} />
        ) : (
          <img src={props.picture} onError={() => setImageSrcFails(true)} loading='lazy' class={imgStyle} />
        )}
        <span>{props.name == "" ? "npub" : props.name}</span>
      </div>
    </>
  );
};

export default EventAuthor;
