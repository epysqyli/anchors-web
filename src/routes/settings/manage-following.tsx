import { A } from "@solidjs/router";
import { nip19 } from "nostr-tools";
import { BsPlus } from "solid-icons/bs";
import { RelayContext } from "~/contexts/relay";
import EventAuthor from "~/components/feed/EventAuthor";
import { TbUserMinus, TbUserPlus } from "solid-icons/tb";
import LoadingPoints from "~/components/feed/LoadingPoints";
import { IUserMetadataWithPubkey } from "~/interfaces/IUserMetadata";
import { For, JSX, Show, VoidComponent, createSignal, onMount, useContext } from "solid-js";

const ManageFollowing: VoidComponent = (): JSX.Element => {
  const { relay, authMode } = useContext(RelayContext);

  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [following, setFollowing] = createSignal<IUserMetadataWithPubkey[]>([]);
  const [followingPubkeys, setFollowingPubkeys] = createSignal<string[]>([]);

  onMount(async () => {
    setIsLoading(true);
    let followPubkeys = relay.following;

    if (followPubkeys.length == 0) {
      followPubkeys = await relay.fetchContacts();
    }

    if (followPubkeys.length !== 0) {
      const usersMetadata = await relay.fetchEventsMetadata(followPubkeys);
      const userMetadataPubkeys = usersMetadata.map((m) => m.pubkey);
      const missingUsers = followPubkeys.filter((pk) => !userMetadataPubkeys.includes(pk));
      missingUsers.forEach((pk) => {
        usersMetadata.push({ about: "", name: "", picture: "", pubkey: pk });
      });

      setFollowing(usersMetadata);
    }

    setFollowingPubkeys(following().map((fl) => fl.pubkey));
    setIsLoading(false);
  });

  const handleClick = async (e: Event, pk: string): Promise<void> => {
    if (isFollowed(pk)) {
      const remainingPubkeys = relay.following.filter((fl) => fl !== pk);
      const pubRes = await relay.followUser(remainingPubkeys);

      if (!pubRes.error) {
        setFollowingPubkeys(remainingPubkeys);
      }
    } else {
      const newPubkeys = [...followingPubkeys(), pk];
      const pubRes = await relay.followUser(newPubkeys);

      if (!pubRes.error) {
        setFollowingPubkeys(newPubkeys);
      }
    }
  };

  const isFollowed = (pk: string): boolean => {
    return followingPubkeys().includes(pk);
  };

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault();

    // @ts-ignore
    let pubkeyToAdd: string = e.target[0].value;
    if (pubkeyToAdd.startsWith("npub")) {
      const decodeResult = nip19.decode(pubkeyToAdd);
      pubkeyToAdd = decodeResult.data as string;
    }

    if (followingPubkeys().includes(pubkeyToAdd)) {
      return;
    }

    const pubRes = await relay.followUser([...followingPubkeys(), pubkeyToAdd]);

    if (!pubRes.error) {
      setFollowingPubkeys(pubRes.data.tags.map((t) => t[1]));
      const usersMetadata = await relay.fetchEventsMetadata([pubkeyToAdd]);

      if (usersMetadata.length == 0) {
        setFollowing([...following(), { pubkey: pubkeyToAdd, name: "", about: "", picture: "" }]);
      } else {
        setFollowing([...following(), ...usersMetadata]);
      }
    }
  };

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold py-5 md:py-10'>
        Manage your following
      </h1>

      <Show when={!isLoading()} fallback={<LoadingPoints />}>
        <div class='h-4/5 w-11/12 md:w-5/6 mx-auto p-3 overflow-y-auto md:custom-scrollbar grid grid-cols-1 md:grid-cols-3 gap-5'>
          {authMode.get() == "private" ? (
            <form
              onsubmit={handleSubmit}
              class='col-span-1 border border-opacity-20 border-slate-200 rounded-md text-slate-300 p-5 flex flex-col justify-between'
            >
              <input
                class='focus:outline-none bg-slate-600 px-1 py-2 rounded-md text-center caret-slate-300 text-slate-300'
                placeholder='Add npub manually'
                type='text'
                spellcheck={false}
                minlength={63}
                maxLength={64}
                required
              />
              <div class='py-10 md:py-5 px-2 mx-auto text-justify text tracking-tight'>
                <p>Make sure to also add the relay(s) where this user is known to post events.</p>
                <A href='/settings/manage-relays' class='underline text-center block mt-2'>
                  Go to my relays
                </A>
              </div>
              <button class='group bg-slate-700 hover:bg-slate-800 transition rounded-md w-2/3 mx-auto'>
                <BsPlus class='text-slate-300 mx-auto group-hover:scale-90 group-active:scale-75' size={36} />
              </button>
            </form>
          ) : (
            <></>
          )}

          <For each={following()}>
            {(flw) => (
              <div
                class='col-span-1 border border-opacity-20 border-slate-200 break-all 
                        rounded-md text-slate-300 p-5 flex flex-col justify-between
                        hover:bg-slate-600 hover:bg-opacity-60'
              >
                <A href={`/users/${flw.pubkey}`} class='bg-slate-600 rounded py-2 hover:bg-slate-500'>
                  <EventAuthor
                    about={flw.about}
                    layout='h'
                    name={flw.name}
                    picture={flw.picture}
                    pubKey={flw.pubkey}
                  />
                </A>

                {authMode.get() == "private" ? (
                  <div class='w-2/3 my-10 mx-auto text-center'>
                    <div
                      onClick={(e) => handleClick(e, flw.pubkey)}
                      class='border w-fit mx-auto p-5 rounded-full border-opacity-25 border-slate-300
                        cursor-pointer transition-all group active:border-opacity-80 hover:bg-slate-500'
                    >
                      {isFollowed(flw.pubkey) ? (
                        <TbUserMinus size={36} class='mx-auto hover:scale-105 active:scale-95' />
                      ) : (
                        <TbUserPlus size={36} class='mx-auto hover:scale-105 active:scale-95' />
                      )}
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                <div class='text-sm text-center border-t border-slate-400 border-opacity-25 pt-5'>
                  {flw.pubkey}
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </>
  );
};

export default ManageFollowing;
