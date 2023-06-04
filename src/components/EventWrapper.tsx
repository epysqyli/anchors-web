import { Event } from "nostr-tools";
import { Component, Show } from "solid-js";

interface Props {
  isNarrow: boolean | undefined;
  event: Event;
}

const EventWrapper: Component<Props> = (props) => {
  return (
    <>
      <Show when={props.isNarrow !== undefined && props.isNarrow}>
        <></>
      </Show>

      <Show when={props.isNarrow !== undefined && !props.isNarrow}>
        <></>
      </Show>
    </>
  );
};

export default EventWrapper;
