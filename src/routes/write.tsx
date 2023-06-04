import { VsReferences } from "solid-icons/vs";
import OverlayContext from "~/contexts/overlay";
import { RelayContext } from "~/contexts/relay";
import WriteInfoPopover from "~/components/WriteInfoPopover";
import { Component, createSignal, useContext } from "solid-js";
import { AiOutlineInfoCircle, AiOutlineSend } from "solid-icons/ai";
import { Event as NostrEvent, EventTemplate, Kind, Pub } from "nostr-tools";

declare global {
  interface Window {
    nostr: {
      signEvent(unsignedEvent: EventTemplate): Promise<NostrEvent>;
    };
  }
}

const Write: Component<{}> = () => {
  const relay = useContext(RelayContext);
  const overlay = useContext(OverlayContext);

  const [nostrEvent] = createSignal<EventTemplate>({
    content: "",
    created_at: Math.floor(Date.now() / 1000),
    kind: Kind.Text,
    tags: [],
    // tags: [
    //   ["r", "https://www.solidjs.com/docs/latest/api#starttransition"],
    //   ["r", "https://www.youtube.com/watch?v=Fu3yMv0KmrE"],
    //   ["r", "https://openlibrary.org/books/OL7506950M"],
    // ],
  });

  const [showPopover, setShowPopover] = createSignal<boolean>(false);
  const togglePopover = (): void => {
    setShowPopover(!showPopover());
    overlay.toggleOverlay();
  };

  const updateContent = (e: Event) => {
    const textAreaContent = (e.currentTarget as HTMLInputElement).value;
    nostrEvent().content = textAreaContent;
  };

  const canPublish = (): boolean => {
    if (nostrEvent().content.trim().length == 0) {
      setShowPopover(true);
      overlay.toggleOverlay();
      return false;
    }

    if (nostrEvent().tags.filter((tag) => tag[0] == "r").length == 0) {
      setShowPopover(true);
      overlay.toggleOverlay();
      return false;
    }

    return true;
  };

  // manage the potential non existence of window.nostr (eg. mobile)
  const signAndPublishNostrEvent = async (): Promise<void> => {
    if (!canPublish()) {
      return;
    }

    const signedEvent = await window.nostr.signEvent(nostrEvent());
    const pubResult: Pub = relay.publish(signedEvent);

    pubResult.on("ok", () => {
      console.log("ok");
    });

    pubResult.on("failed", () => {
      console.log("failed");
    });
  };

  return (
    <>
      <h1 class="text-slate-100 text-center py-5 md:py-12 text-lg md:text-2xl">
        Post a new idea
      </h1>
      <textarea
        placeholder="An idea that gives meaning to the world ..."
        class="block focus:outline-none w-11/12 md:w-2/3 mx-auto bg-transparent p-5 md:p-10
               text-slate-300 caret-orange-200 resize-none custom-scrollbar"
        rows={15}
        onInput={updateContent}
      ></textarea>

      <div class="flex mx-auto text-slate-100 justify-between w-3/5 md:w-2/5 mt-20 md:mt-32">
        <button>
          <AiOutlineInfoCircle size={32} onClick={togglePopover} />
        </button>
        <button>
          <VsReferences size={32} />
        </button>
        <button onClick={signAndPublishNostrEvent}>
          <AiOutlineSend size={32} />
        </button>
      </div>

      <WriteInfoPopover
        showPopover={showPopover()}
        togglePopover={togglePopover}
      />
    </>
  );
};

export default Write;
