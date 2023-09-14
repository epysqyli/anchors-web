import { A } from "@solidjs/router";
import { Event } from "nostr-tools";
import { CgRemove } from "solid-icons/cg";
import { Component, JSX } from "solid-js";
import { parseDate, shrinkContent } from "~/lib/nostr/nostr-utils";

interface Props {
  nostrEvent: Event;
  handleDeletion(nostrEventID: string): Promise<void>;
}

const UserNostrEvent: Component<Props> = (props): JSX.Element => {
  const deleteEvent = async (): Promise<void> => {
    await props.handleDeletion(props.nostrEvent.id);
  };

  return (
    <div
      class='col-span-1 py-5 px-5 mx-auto text-slate-300 border border-opacity-20 border-slate-200
            bg-opacity-90 rounded-md hover:text-slate-200 flex flex-col justify-between'
    >
      <div class='flex items-center justify-around'>
        <div class='px-2 py-1 text-center rounded-md'>{parseDate(props.nostrEvent.created_at)}</div>
        <div onClick={deleteEvent} class='text-neutral-400 cursor-pointer group hover:text-red-400'>
          <CgRemove size={28} class='transition-all mx-auto group-hover:scale-105 group-active:scale-90' />
        </div>
      </div>

      <div class='w-4/5 my-10 mx-auto text-center break-words'>{shrinkContent(props.nostrEvent.content)}</div>

      <A
        href={`/events/${props.nostrEvent.id}`}
        class='text-sm text-slate-400 break-all bg-slate-700
        hover:text-slate-200 active:scale-95 p-2 rounded-md transition-all'
      >
        {props.nostrEvent.id}
      </A>
    </div>
  );
};

export default UserNostrEvent;
