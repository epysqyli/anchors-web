import { Event } from "nostr-tools";
import { Component, JSX } from "solid-js";
import { RiSystemDeleteBin3Line } from "solid-icons/ri";
import { VsOpenPreview } from "solid-icons/vs";
import { parseDate, shrinkContent } from "~/lib/nostr/nostr-utils";

const UserNostrEvent: Component<{ nostrEvent: Event }> = (props): JSX.Element => {
  return (
    <div class='shadow-xl py-5 px-5 text-slate-300 bg-neutral-700 bg-opacity-75 rounded-md hover:text-slate-200'>
      <div class='bg-slate-600 text-center rounded-md mx-auto w-3/4 break-words'>
        {parseDate(props.nostrEvent.created_at)}
      </div>
      <div class='text-sm my-5 text-neutral-400 break-all'>{props.nostrEvent.id}</div>
      <div class="break-all">{shrinkContent(props.nostrEvent.content)}</div>
      <div
        class='flex items-center justify-around w-4/5 mx-auto border-t border-opacity-50
                 border-neutral-100 mt-5 pt-4 text-neutral-400 transition-all'
      >
        <VsOpenPreview size={30} class='cursor-pointer hover:scale-110 active:scale-90 hover:text-neutral-100' />
        <RiSystemDeleteBin3Line class='cursor-pointer hover:scale-110 active:scale-90 hover:text-red-300' size={30} />
      </div>
    </div>
  );
};

export default UserNostrEvent;
