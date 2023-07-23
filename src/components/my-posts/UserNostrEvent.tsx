import { A } from "@solidjs/router";
import { Event } from "nostr-tools";
import { Component, JSX } from "solid-js";
import { parseDate, shrinkContent } from "~/lib/nostr/nostr-utils";

const UserNostrEvent: Component<{ nostrEvent: Event }> = (props): JSX.Element => {
  return (
    <div class='h-full flex flex-col justify-between shadow-xl py-5 px-5 text-slate-300 bg-neutral-700 bg-opacity-75 rounded-md hover:text-slate-200'>
      <div class='bg-slate-600 text-center rounded-md mx-auto w-3/4 break-words'>
        {parseDate(props.nostrEvent.created_at)}
      </div>
      <A
        href={`/events/${props.nostrEvent.id}`}
        class='text-sm my-5 text-neutral-400 break-all bg-neutral-600
               hover:text-neutral-200 active:scale-95 p-2 rounded-md transition-all'
      >
        {props.nostrEvent.id}
      </A>
      <div class='break-all'>{shrinkContent(props.nostrEvent.content)}</div>
      <div class='flex items-center justify-around w-4/5 mx-auto mt-5 pt-4 text-neutral-400 transition-all'>
        <span>reactions</span>
        <span>comments</span>
        <span>delete</span>
      </div>
    </div>
  );
};

export default UserNostrEvent;
