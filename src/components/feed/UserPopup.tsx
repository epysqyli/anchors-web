import { A } from "@solidjs/router";
import { Event } from "nostr-tools";
import EventAuthor from "./EventAuthor";
import LoadingFallback from "./LoadingFallback";
import { RelayContext } from "~/contexts/relay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
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
  const { relay, authMode } = useContext(RelayContext);

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

  const showFollowAction = () => authMode.get() == "private" && relay.userPubKey != props.pubkey;

  onMount(async () => {
    setIsLoading(true);

    setEvents(
      await relay.fetchTextEvents({
        rootOnly: true,
        isAnchorsMode: false,
        filter: { authors: [props.pubkey] },
        postFetchLimit: 3
      })
    );

    setIsLoading(false);
  });

  return (
    <>
      <Show when={useIsNarrow() != undefined && useIsNarrow()}>
        <div class='h-screen w-screen bg-slate-800 bg-opacity-95'>
          <div class='w-5/6 mx-auto py-10 h-full'>
            <A href={`/users/${props.pubkey}`}>
              <EventAuthor
                name={props.name}
                about={props.about}
                picture={props.picture}
                pubKey={props.pubkey}
                layout='h'
              />
            </A>

            <p class='text-sm rounded text-left my-10 text-neutral-300 px-2 py-2 h-1/4 overflow-y-auto'>
              {props.about}
            </p>

            <Show
              fallback={
                <div class='my-5 h-1/4 relative scale-50'>
                  <LoadingFallback />
                </div>
              }
              when={!isLoading()}
            >
              <h2 class='text-center mb-5'>Recent posts</h2>
              <For each={events()}>
                {(evt) => (
                  <A href={`/events/${evt.id}`}>
                    <div class='text-sm break-all mb-2 hover:bg-slate-700 active:scale-95 rounded-md p-1'>
                      <div class='text-neutral-300 mb-1 text-left'>{parseDate(evt.created_at)}</div>
                      <div class='text-neutral-400 text-left'>{shrinkContent(evt.content, 100)}</div>
                    </div>
                  </A>
                )}
              </For>
            </Show>

            {showFollowAction() ? (
              <div class='mx-auto w-fit mt-10'>
                <div
                  onClick={handleClick}
                  class='border w-fit mx-auto p-5 rounded-full border-opacity-25 border-slate-300
                       cursor-pointer transition-all group active:border-opacity-80 hover:bg-slate-500'
                >
                  {canFollow() ? (
                    <TbUsersPlus size={28} class='mx-auto hover:scale-105 active:scale-95' />
                  ) : (
                    <TbUsersMinus size={28} class='mx-auto hover:scale-105 active:scale-95' />
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Show>

      <Show when={useIsNarrow() != undefined && !useIsNarrow()}>
        <div class='mx-auto h-full'>
          <div class='flex items-start justify-around gap-x-10 h-4/5 pt-20'>
            <div class='w-1/2 h-full'>
              <A href={`/users/${props.pubkey}`} class='hover:text-neutral-400 active:text-neutral-300'>
                <EventAuthor
                  name={props.name}
                  about={props.about}
                  picture={props.picture}
                  pubKey={props.pubkey}
                  layout='h'
                />
              </A>
              <p class='mx-auto text-sm text-neutral-200 text-opacity-75 pt-3 pr-2 mt-5 h-2/3 overflow-y-auto md:custom-scrollbar'>
                {props.about}
              </p>
            </div>

            <div class='w-1/2'>
              <Show
                fallback={
                  <div class='mt-20 relative scale-50'>
                    <LoadingFallback />
                  </div>
                }
                when={!isLoading()}
              >
                <h2 class='mb-5 w-fit mx-auto px-5'>Recent posts</h2>
                <For each={events()}>
                  {(evt) => (
                    <A href={`/events/${evt.id}`}>
                      <div class='text-sm break-all mb-2 hover:bg-slate-700 active:scale-95 rounded-md p-1'>
                        <div class='text-neutral-300 mb-1 text-left'>{parseDate(evt.created_at)}</div>
                        <div class='text-neutral-400 text-left'>{shrinkContent(evt.content, 100)}</div>
                      </div>
                    </A>
                  )}
                </For>
              </Show>
            </div>
          </div>

          {showFollowAction() ? (
            <div class='mx-auto w-fit'>
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
          ) : (
            <></>
          )}
        </div>
      </Show>
    </>
  );
};

export default UserPopup;
