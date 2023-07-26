import { A } from "@solidjs/router";
import { Event } from "nostr-tools";
import { CgRemove } from "solid-icons/cg";
import { Component, JSX } from "solid-js";
import { parseDate, shrinkContent } from "~/lib/nostr/nostr-utils";

const UserNostrEvent: Component<{ nostrEvent: Event }> = (props): JSX.Element => {
  return (
    <div class='h-full flex flex-col justify-between shadow-xl py-5 px-5 text-slate-300 bg-neutral-700 bg-opacity-75 rounded-md hover:text-slate-200'>
      <div class='bg-slate-600 text-center rounded-md mx-auto w-3/4 break-words'>
        {parseDate(props.nostrEvent.created_at)}
      </div>

      <div class='break-all my-10'>{shrinkContent(props.nostrEvent.content)}</div>
      <A
        href={`/events/${props.nostrEvent.id}`}
        class='text-sm text-slate-400 break-all bg-slate-600
               hover:text-slate-200 active:scale-95 p-2 rounded-md transition-all'
      >
        {props.nostrEvent.id}
      </A>
      <div class='w-4/5 mx-auto mt-10 text-neutral-400 cursor-pointer group'>
        <CgRemove
          size={32}
          class='transition-all mx-auto group-hover:scale-105 group-hover:text-neutral-200 group-active:scale-90'
        />
      </div>
    </div>
  );
};

export default UserNostrEvent;
