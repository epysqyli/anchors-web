import { Component, JSX } from "solid-js";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { shrinkContent } from "~/lib/nostr/nostr-utils";

const UserNostrEvent: Component<{ nostrEvent: IEnrichedEvent }> = (props): JSX.Element => {
  return (
    <div class='break-all py-5 px-5 border text-slate-200'>
      <div>{props.nostrEvent.created_at}</div>
      <div>{props.nostrEvent.id}</div>
      <div>{shrinkContent(props.nostrEvent.content)}</div>
      <div class='border-t mt-2'>section with actions</div>
    </div>
  );
};

export default UserNostrEvent;
