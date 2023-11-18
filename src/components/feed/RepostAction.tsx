import { Event } from "nostr-tools";
import { FiTrendingUp } from "solid-icons/fi";
import { RelayContext } from "~/contexts/relay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { Component, JSX, Show, useContext } from "solid-js";

const RepostAction: Component<{ enrichedEvent: IEnrichedEvent }> = (props): JSX.Element => {
  const { relay, anchorsMode } = useContext(RelayContext);

  const handleClick = async (): Promise<void> => {
    const event: Event = {
      content: props.enrichedEvent.content,
      created_at: props.enrichedEvent.created_at,
      id: props.enrichedEvent.id,
      kind: props.enrichedEvent.kind,
      pubkey: props.enrichedEvent.pubkey,
      sig: props.enrichedEvent.sig,
      tags: props.enrichedEvent.tags
    };

    const pubResult = await relay.repostEvent(event, anchorsMode.get());

    if (pubResult.error) {
      console.log("could not repost post");
    } else {
      console.log("repost: success");
    }
  };

  return (
    <>
      <Show when={useIsNarrow() != undefined && useIsNarrow()}>
        <div onClick={handleClick} class='group w-1/6 transition'>
          <FiTrendingUp class='text-slate-400 mx-auto group-active:text-slate-200' size={26} />
        </div>
      </Show>

      <Show when={useIsNarrow() != undefined && !useIsNarrow()}>
        <div onClick={handleClick} class='group cursor-pointer transition'>
          <FiTrendingUp class='text-slate-400 group-hover:text-slate-200' size={26} />
        </div>
      </Show>
    </>
  );
};

export default RepostAction;
