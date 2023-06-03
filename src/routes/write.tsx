import { VsReferences } from "solid-icons/vs";
import { RelayContext } from "~/contexts/relay";
import { Component, createSignal, useContext } from "solid-js";
import { AiOutlineInfoCircle, AiOutlineSend } from "solid-icons/ai";
import { Event as NostrEvent, EventTemplate, Kind } from "nostr-tools";

declare global {
  interface Window {
    nostr: {
      signEvent(unsignedEvent: EventTemplate): Promise<NostrEvent>;
    };
  }
}

const Write: Component<{}> = () => {
  const relay = useContext(RelayContext);

  const [nostrEvent] = createSignal<EventTemplate>({
    content: "",
    created_at: Math.floor(Date.now() / 1000),
    kind: Kind.Text,
    tags: [["r", "https://www.solidjs.com/docs/latest/api#starttransition"]],
  });

  const [canPublish, setCanPublish] = createSignal<boolean>(false);

  const updateContent = (e: Event) => {
    const textAreaContent = (e.currentTarget as HTMLInputElement).value;
    nostrEvent().content = textAreaContent;
  };

  // manage the potential non existence of window.nostr (eg. mobile)
  const signAndPublishNostrEvent = async (): Promise<void> => {
    const signedEvent = await window.nostr.signEvent(nostrEvent());
    relay.publish(signedEvent);
  };

  return (
    <>
      <h1 class="text-slate-100 text-center py-5 md:py-10 text-lg md:text-2xl">
        Post a new idea
      </h1>
      <textarea
        placeholder="An idea that gives meaning to the world ..."
        class="block focus:outline-none w-11/12 md:w-2/3 mx-auto bg-transparent p-5 md:p-10 text-slate-300
              caret-orange-200 resize-none"
        rows={15}
        onInput={updateContent}
      ></textarea>

      <div class="flex mx-auto text-slate-100 justify-between w-3/5 md:w-2/5 mt-20 md:mt-32">
        <button>
          {/* popover info about why anchors needs references (not twitter) */}
          <AiOutlineInfoCircle size={32} />
        </button>
        <button>
          <VsReferences size={32} />
        </button>
        {/* !canPublish results in the same info popover */}
        <button onClick={signAndPublishNostrEvent}>
          <AiOutlineSend size={32} />
        </button>
      </div>
    </>
  );
};

export default Write;
