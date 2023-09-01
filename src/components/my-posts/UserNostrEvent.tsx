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
      class='my-5 py-5 px-5 mx-auto gap-x-5 flex items-center justify-between 
            border-y-2 border-neutral-600 text-slate-300 bg-slate-700 
            bg-opacity-90 rounded-md hover:text-slate-200'
    >
      <div class='w-1/5 bg-slate-600 text-center rounded-md mx-auto break-words'>
        {parseDate(props.nostrEvent.created_at)}
      </div>

      <div class='w-2/5 break-all'>{shrinkContent(props.nostrEvent.content)}</div>

      <A
        href={`/events/${props.nostrEvent.id}`}
        class='w-2/5 text-sm text-slate-400 break-all bg-slate-600
        hover:text-slate-200 active:scale-95 p-2 rounded-md transition-all'
      >
        {props.nostrEvent.id}
      </A>
      <div onClick={deleteEvent} class='text-neutral-400 cursor-pointer group'>
        <CgRemove
          size={32}
          class='transition-all mx-auto group-hover:scale-105 group-hover:text-neutral-200 group-active:scale-90'
        />
      </div>
    </div>
  );
};

export default UserNostrEvent;
