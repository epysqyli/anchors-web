import { Event } from "nostr-tools";
import { Component, JSX } from "solid-js";
import { parseDate, shrinkContent } from "~/lib/nostr/nostr-utils";

const UserNostrEvent: Component<{ nostrEvent: Event }> = (props): JSX.Element => {
  return (
    <div class='break-all py-5 px-5 border text-slate-200'>
      <div>{parseDate(props.nostrEvent.created_at)}</div>
      <div>{props.nostrEvent.id}</div>
      <div>{shrinkContent(props.nostrEvent.content)}</div>
      <div class='border-t mt-2'>section with actions</div>
    </div>
  );
};

export default UserNostrEvent;
