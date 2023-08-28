import { A } from "@solidjs/router";
import { Event } from "nostr-tools";
import EventAuthor from "./EventAuthor";
import { RelayContext } from "~/contexts/relay";
import { TbUsersPlus, TbUsersMinus } from "solid-icons/tb";
import { parseDate, shrinkContent } from "~/lib/nostr/nostr-utils";
import { Component, For, JSX, createSignal, onMount, useContext } from "solid-js";

interface Props {
  name: string;
  about: string;
  picture: string;
  pubkey: string;
}

const UserPopup: Component<Props> = (props): JSX.Element => {
  const { relay } = useContext(RelayContext);
  const [canFollow, setCanFollow] = createSignal<boolean>(!relay.isUserAlreadyFollowed(props.pubkey));
  const [userEvents, setUserEvents] = createSignal<Event[]>([]);

  const handleFollow = async (): Promise<void> => {
    await relay.followUser([...relay.following, props.pubkey]);
    setCanFollow(false);
  };

  const handleUnfollow = async (): Promise<void> => {
    await relay.followUser(relay.following.filter((fl) => fl !== props.pubkey));
    setCanFollow(true);
  };

  onMount(() => {
    relay.fetchUserEvents(setUserEvents, { authors: [props.pubkey], limit: 3 });
  });

  return (
    <div class='flex items-center justify-around'>
      <div class='w-1/2'>
        <A href={`/users/${props.pubkey}`} class='hover:text-neutral-400 active:text-neutral-300'>
          <EventAuthor
            name={props.name}
            about={props.about}
            picture={props.picture}
            pubKey={props.pubkey}
            layout='v'
          />
        </A>
        <div class='mt-10 mx-auto w-fit'>
          {relay.userPubKey == props.pubkey ? (
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

      <div class='w-1/2'>
        <For each={userEvents()}>
          {(evt) => (
            <A href={`/events/${evt.id}`}>
              <div class='text-sm break-all mb-2 hover:bg-neutral-800 active:scale-95 rounded-md p-1'>
                <div class='text-neutral-300 mb-1 text-left'>{parseDate(evt.created_at)}</div>
                <div class='text-neutral-400 text-left'>{shrinkContent(evt.content, 30)}</div>
              </div>
            </A>
          )}
        </For>
      </div>
    </div>
  );
};

export default UserPopup;
