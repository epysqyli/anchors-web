import IRefTag from "~/interfaces/IRefTag";
import { VsReferences } from "solid-icons/vs";
import { RelayContext } from "~/contexts/relay";
import { AiOutlineSend } from "solid-icons/ai";
import RefTagsMenu from "~/components/RefTagsMenu";
import { Component, createSignal, useContext } from "solid-js";
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

  const [nostrEvent, setNostrEvent] = createSignal<EventTemplate>(
    {
      content: "",
      created_at: Math.floor(Date.now() / 1000),
      kind: Kind.Text,
      tags: [],
    },
    { equals: false }
  );

  const [refTags, setRefTags] = createSignal<IRefTag[]>([], { equals: false });

  const [showRefMenu, setShowRefMenu] = createSignal<boolean>(false);
  const toggleRefMenu = (): void => {
    setShowRefMenu(!showRefMenu());
  };

  const updateContent = (e: Event) => {
    const textAreaContent = (e.currentTarget as HTMLInputElement).value;
    nostrEvent().content = textAreaContent;
  };

  const canPublish = (): boolean => {
    if (nostrEvent().content.trim().length == 0) {
      console.log("cannot publish");
      return false;
    }

    if (nostrEvent().tags.filter((tag) => tag[0] == "r").length == 0) {
      console.log("cannot publish");
      return false;
    }

    return true;
  };

  const addNostrTag = (nostrTag: IRefTag): void => {
    const newNostrEvent = nostrEvent();
    newNostrEvent.tags = [...nostrEvent().tags, ["r", nostrTag.value]];
    setNostrEvent(newNostrEvent);

    // add to refTags for RefSearchTagView
    const newRefTags = [...refTags(), nostrTag];
    setRefTags(newRefTags);
  };

  const removeNostrTag = (nostrTag: IRefTag): void => {
    const indexOfTagToRemove = nostrEvent().tags.findIndex(
      (t) => t[1] === nostrTag.value
    );

    const currentTags = nostrEvent().tags;
    currentTags.splice(indexOfTagToRemove, 1);
    const newNostrEvent = nostrEvent();
    newNostrEvent.tags = currentTags;
    setNostrEvent(newNostrEvent);

    // remove from refTags for RefSearchTagView
    const indexOfRefTagToRemove = refTags().findIndex(
      (rf) => rf.value == nostrTag.value
    );

    const currentRefTags = refTags();
    currentRefTags.splice(indexOfRefTagToRemove, 1);
    setRefTags(currentRefTags);
  };

  // manage the potential non existence of window.nostr (eg. mobile)
  // manage ok and failed states once the event is published
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
      <h1
        class="text-slate-100 text-center py-5 md:py-10 text-2xl md:text-4xl font-bold
                  md:bg-slate-800 md:rounded-t-md border-b border-slate-500 md:border-none"
      >
        Write a new idea
      </h1>
      <div class="relative flex-col justify-between h-[65vh]">
        <textarea
          placeholder="An idea that gives meaning to the world ..."
          class="block focus:outline-none w-11/12 md:w-2/3 mx-auto bg-transparent p-5 md:p-10
               text-slate-300 caret-orange-200 resize-none custom-scrollbar mt-5 grow-1 h-full"
          rows={15}
          onInput={updateContent}
        ></textarea>

        <div
          class="flex mx-auto text-slate-100 justify-between md:justify-around 
                  w-3/5 md:w-2/5 md:py-5
                  md:border-t-2 shadow-inner md:border-slate-200
                  md:border-dotted md:border-opacity-25"
        >
          <button
            class="hover:text-orange-200 active:scale-95 transition-all"
            onclick={toggleRefMenu}
          >
            <VsReferences size={32} />
          </button>
          <button
            class="hover:text-orange-200 active:scale-95 transition-all"
            onClick={signAndPublishNostrEvent}
          >
            <AiOutlineSend size={32} />
          </button>
        </div>

        <RefTagsMenu
          showRefMenu={showRefMenu()}
          tags={refTags()}
          toggleRefMenu={toggleRefMenu}
          addNostrTag={addNostrTag}
          removeTag={removeNostrTag}
        />
      </div>
    </>
  );
};

export default Write;
