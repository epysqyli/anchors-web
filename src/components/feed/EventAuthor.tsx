import { Component, createSignal } from "solid-js";
import { RiUserFacesAccountCircleFill } from "solid-icons/ri";
import { IUserMetadata } from "~/interfaces/IUserMetadata";

const EventAuthor: Component<IUserMetadata & { pubKey: string }> = (props) => {
  const [imageSrcFails, setImageSrcFails] = createSignal<boolean>(false);

  return (
    <>
      <div class='flex justify-center items-center gap-x-3 rounded-md'>
        {imageSrcFails() ? (
          <RiUserFacesAccountCircleFill size={30} />
        ) : (
          <img
            src={props.picture}
            onError={() => setImageSrcFails(true)}
            loading='lazy'
            class='h-7 rounded-full'
          />
        )}
        <span>{props.name == "" ? "npub" : props.name}</span>
      </div>
    </>
  );
};

export default EventAuthor;
