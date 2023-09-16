import { A } from "@solidjs/router";
import { Event } from "nostr-tools";
import EventAuthor from "./EventAuthor";
import LoadingFallback from "./LoadingFallback";
import { RelayContext } from "~/contexts/relay";
import { TbUsersPlus, TbUsersMinus } from "solid-icons/tb";
import { parseDate, shrinkContent } from "~/lib/nostr/nostr-utils";
import { Component, For, JSX, Show, createSignal, onMount, useContext } from "solid-js";

interface Props {
  name: string;
  about: string;
  picture: string;
  pubkey: string;
}

const UserPopup: Component<Props> = (props): JSX.Element => {
  const { relay } = useContext(RelayContext);

  const [events, setEvents] = createSignal<Event[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [canFollow, setCanFollow] = createSignal<boolean>(!relay.isUserAlreadyFollowed(props.pubkey));

  const handleClick = async (): Promise<void> => {
    if (canFollow()) {
      const pubRes = await relay.followUser([...relay.following, props.pubkey]);
      if (!pubRes.error) {
        setCanFollow(false);
      } else {
        console.log("error following user");
      }
    } else {
      const pubRes = await relay.followUser(relay.following.filter((fl) => fl !== props.pubkey));

      if (!pubRes.error) {
        setCanFollow(true);
      } else {
        console.log("error unfollowing user");
      }
    }
  };

  onMount(async () => {
    setIsLoading(true);
    setEvents(await relay.fetchTextEvents({ authors: [props.pubkey], limit: 3 }, true));
    setIsLoading(false);
  });

  return (
    <div class='mx-auto'>
      <div class='flex items-center justify-around gap-x-10'>
        <div class='w-1/2'>
          <A href={`/users/${props.pubkey}`} class='hover:text-neutral-400 active:text-neutral-300'>
            <EventAuthor
              name={props.name}
              about={props.about}
              picture={props.picture}
              pubKey={props.pubkey}
              layout='h'
            />
          </A>
          <p class='w-4/5 mx-auto text-sm text-justify text-neutral-200 text-opacity-75 my-2
                     border-t border-neutral-200 border-opacity-50 pt-3 mt-5'>
            {props.about}
          </p>
        </div>

        <div class='w-1/2'>
          <Show
            fallback={
              <div class='relative scale-50'>
                <LoadingFallback />
              </div>
            }
            when={!isLoading()}
          >
            <h2 class='mb-5 bg-neutral-500 bg-opacity-40 rounded w-fit mx-auto px-5'>Recent posts</h2>
            <For each={events()}>
              {(evt) => (
                <A href={`/events/${evt.id}`}>
                  <div class='text-sm break-all mb-2 hover:bg-neutral-800 active:scale-95 rounded-md p-1'>
                    <div class='text-neutral-300 mb-1 text-left'>{parseDate(evt.created_at)}</div>
                    <div class='text-neutral-400 text-left'>{shrinkContent(evt.content, 100)}</div>
                  </div>
                </A>
              )}
            </For>
          </Show>
        </div>
      </div>

      <div class='mt-10 mx-auto w-fit'>
        <div
          onClick={handleClick}
          class='border w-fit mx-auto p-5 rounded-full border-opacity-25 border-slate-300
          cursor-pointer transition-all group active:border-opacity-80 hover:bg-slate-500'
        >
          {canFollow() ? (
            <TbUsersPlus size={32} class='mx-auto hover:scale-105 active:scale-95' />
          ) : (
            <TbUsersMinus size={32} class='mx-auto hover:scale-105 active:scale-95' />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPopup;
