import { JSX } from "solid-js";
import { A, useSearchParams } from "solid-start";
import { FeedSearchParams } from "~/types/FeedSearchParams";

const FollowingSelector = (): JSX.Element => {
  const [searchParams] = useSearchParams<FeedSearchParams>();

  const isFollowing = (): boolean => searchParams.following == "on";
  const relayAddress = (): string => {
    const { relayAddress } = searchParams;
    return relayAddress == "undefined" ? "all" : relayAddress;
  };

  const followingOnHref = (): string => {
    return `/?following=on&relayAddress=${relayAddress()}`;
  };

  const followingOffHref = (): string => {
    return `/?following=off&relayAddress=${relayAddress()}`;
  };

  const isFollowingStyle =
    "w-fit text-base rounded-t px-3 py-1 text-neutral-300 bg-neutral-800 border-b border-neutral-300";
  const isNotFollowingStyle =
    "w-fit text-base rounded px-3 py-1 text-neutral-500 bg-neutral-700 hover:text-neutral-400";

  return (
    <>
      <A class={isFollowing() ? isFollowingStyle : isNotFollowingStyle} href={followingOnHref()}>
        <span>following</span>
      </A>
      <A class={isFollowing() ? isNotFollowingStyle : isFollowingStyle} href={followingOffHref()}>
        <span>all users</span>
      </A>
    </>
  );
};

export default FollowingSelector;
