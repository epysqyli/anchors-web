import { A } from "solid-start";
import { Component, JSX } from "solid-js";
import EventAuthor from "../feed/EventAuthor";
import EventWithMetadata from "~/interfaces/EventWithMetadata";
import { parseDate, shrinkContent } from "~/lib/nostr/nostr-utils";

interface Props {
  event: EventWithMetadata;
}

const FavoritePost: Component<Props> = (props): JSX.Element => {
  return (
    <div
      class='col-span-1 py-5 px-5 mx-auto text-slate-300 border border-opacity-20 border-slate-200
            bg-opacity-90 rounded-md hover:text-slate-200 flex flex-col justify-between'
    >
      <div class='flex items-center justify-around'>
        <div class='px-2 py-1 text-center rounded-md'>{parseDate(props.event.created_at)}</div>
      </div>

      <div class='w-4/5 my-10 mx-auto grow break-words'>{shrinkContent(props.event.content)}</div>

      <A
        href={`/events/${props.event.id}`}
        class='text-sm text-slate-400 break-all bg-slate-700 border border-transparent
             hover:text-slate-300 active:border-slate-500 p-2 rounded-md transition-all'
      >
        {props.event.id}
      </A>

      <A
        href={`/users/${props.event.pubkey}`}
        class='bg-slate-600 active:bg-slate-700 rounded py-2 mt-2 hover:bg-slate-500'
      >
        <EventAuthor
          about={props.event.about}
          layout='h'
          name={props.event.name}
          picture={props.event.picture}
          pubKey={props.event.pubkey}
        />
      </A>
    </div>
  );
};

export default FavoritePost;
