import { Component, JSX } from "solid-js";
import EventAuthor from "./EventAuthor";

interface Props {
  name: string;
  about: string;
  picture: string;
  pubkey: string;
}

const UserPopup: Component<Props> = (props): JSX.Element => {
  return (
    <div class='flex items-center justify-around'>
      <div>
        <EventAuthor name={props.name} about={props.about} picture={props.picture} pubKey={props.pubkey} />
        <div>follow</div>
        <div>unfollow</div>
      </div>

      <div>
        <div>recent event</div>
        <div>recent event</div>
        <div>recent event</div>
        <div>recent event</div>
        <div>recent event</div>
      </div>
    </div>
  );
};

export default UserPopup;
