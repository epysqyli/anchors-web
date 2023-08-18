import EventAuthor from "./EventAuthor";
import { RelayContext } from "~/contexts/relay";
import { TbUsersPlus, TbUsersMinus } from "solid-icons/tb";
import { Component, JSX, createSignal, useContext } from "solid-js";
import { followUser, isUserAlreadyFollowed } from "~/lib/nostr/nostr-nips-actions";
import { A } from "@solidjs/router";

interface Props {
  name: string;
  about: string;
  picture: string;
  pubkey: string;
}

const UserPopup: Component<Props> = (props): JSX.Element => {
  const { relay, publicKey, following } = useContext(RelayContext);

  const handleFollow = async (): Promise<void> => {
    await followUser(relay, [...following(), props.pubkey]);
    setCanFollow(false);
  };

  const handleUnfollow = async (): Promise<void> => {
    await followUser(
      relay,
      following().filter((fl) => fl !== props.pubkey)
    );
    setCanFollow(true);
  };

  const [canFollow, setCanFollow] = createSignal<boolean>(!isUserAlreadyFollowed(props.pubkey, following));

  return (
    <div class='flex items-center justify-around'>
      <div class='w-1/2'>
        <A href={`/users/${props.pubkey}`} class="hover:text-neutral-400 active:text-neutral-300">
          <EventAuthor name={props.name} about={props.about} picture={props.picture} pubKey={props.pubkey} />
        </A>
        <div class='mt-10 mx-auto w-fit'>
          {publicKey == props.pubkey ? (
            <></>
          ) : canFollow() ? (
            <div
              onClick={handleFollow}
              class='text-neutral-300 hover:text-neutral-100 active:scale-95 cursor-pointer'
            >
              <TbUsersPlus size={32} />
            </div>
          ) : (
            <div
              onClick={handleUnfollow}
              class='text-neutral-300 hover:text-neutral-100 active:scale-95 cursor-pointer'
            >
              <TbUsersMinus size={32} />
            </div>
          )}
        </div>
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
