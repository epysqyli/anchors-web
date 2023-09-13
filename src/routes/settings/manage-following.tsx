import { A } from "@solidjs/router";
import { RelayContext } from "~/contexts/relay";
import { Event as NostrEvent } from "nostr-tools";
import EventAuthor from "~/components/feed/EventAuthor";
import { IUserMetadataWithPubkey } from "~/interfaces/IUserMetadata";
import { For, JSX, VoidComponent, createSignal, onMount, useContext } from "solid-js";
import { TbUserMinus, TbUserPlus } from "solid-icons/tb";

const ManageFollowing: VoidComponent = (): JSX.Element => {
  const { relay } = useContext(RelayContext);

  const [following, setFollowing] = createSignal<IUserMetadataWithPubkey[]>([]);
  const [followingPubkeys, setFollowingPubkeys] = createSignal<string[]>([]);

  onMount(async () => {
    let followPubkeys = relay.following;

    if (followPubkeys.length == 0) {
      const kindThreeEvent: NostrEvent | undefined = await relay.fetchFollowingAndRelays();
      if (kindThreeEvent) {
        followPubkeys = kindThreeEvent.tags.map((f) => f[1]);
      }
    }

    if (followPubkeys.length !== 0) {
      const usersMetadata = await relay.fetchEventsMetadata({ authors: followPubkeys });
      const userMetadataPubkeys = usersMetadata.map((m) => m.pubkey);
      const missingUsers = followPubkeys.filter((pk) => !userMetadataPubkeys.includes(pk));
      missingUsers.forEach((pk) => {
        usersMetadata.push({ about: "", name: "", picture: "", pubkey: pk });
      });

      setFollowing(usersMetadata);
    }

    setFollowingPubkeys(following().map((fl) => fl.pubkey));
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

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold mt-14'>Manage your following</h1>

      <div class='h-4/5 w-5/6 mx-auto mt-10 p-3 overflow-y-auto custom-scrollbar grid grid-cols-3 gap-5'>
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

              <div class='w-2/3 my-10 mx-auto text-center'>
                <div
                  onClick={(e) => handleClick(e, flw.pubkey)}
                  class='border w-fit mx-auto p-5 rounded-full border-opacity-25 border-slate-300
                        cursor-pointer transition-all group active:border-opacity-80'
                >
                  {isFollowed(flw.pubkey) ? (
                    <TbUserMinus size={36} class='mx-auto hover:scale-105 active:scale-95' />
                  ) : (
                    <TbUserPlus size={36} class='mx-auto hover:scale-105 active:scale-95' />
                  )}
                </div>
              </div>

              <div class='text-sm text-center border-t border-slate-400 border-opacity-25 pt-5'>
                {flw.pubkey}
              </div>
            </div>
          )}
        </For>
      </div>
    </>
  );
};

export default ManageFollowing;
