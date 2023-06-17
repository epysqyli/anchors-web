import { VsSend } from "solid-icons/vs";
import { IRefTag } from "~/interfaces/IRefTag";
import { RelayContext } from "~/contexts/relay";
import { Component, createSignal, useContext } from "solid-js";
import { Event as NostrEvent, EventTemplate, Kind, Pub } from "nostr-tools";
import RefTagsSearchPanel from "~/components/write/RefTagsSearchPanel";

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
      tags: []
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
    newNostrEvent.tags = [...nostrEvent().tags, ["r", nostrTag.url]];
    setNostrEvent(newNostrEvent);

    // add to refTags for RefSearchTagView
    const newRefTags = [...refTags(), nostrTag];
    setRefTags(newRefTags);
  };

  const removeNostrTag = (nostrTag: IRefTag): void => {
    const indexOfTagToRemove = nostrEvent().tags.findIndex((t) => t[1] === nostrTag.url);

    const currentTags = nostrEvent().tags;
    currentTags.splice(indexOfTagToRemove, 1);
    const newNostrEvent = nostrEvent();
    newNostrEvent.tags = currentTags;
    setNostrEvent(newNostrEvent);

    // remove from refTags for RefSearchTagView
    const indexOfRefTagToRemove = refTags().findIndex((rf) => rf.url == nostrTag.url);

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
    <div class='flex gap-x-2 h-[96vh] absolute w-[99%] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
      <div class='w-3/5 rounded'>
        <h1
          class='text-slate-100 text-center py-5 md:py-10 text-2xl md:text-4xl font-bold
                  md:bg-slate-800 rounded border-b border-slate-500 md:border-none'
        >
          Write a new idea
        </h1>
        <textarea
          placeholder='An idea that gives meaning to the world ...'
          class='block focus:outline-none w-11/12 md:w-3/4 mx-auto bg-transparent p-5 md:p-10
               text-slate-300 caret-orange-200 resize-none custom-scrollbar mt-5 border-b'
          rows={18}
          onInput={updateContent}
        ></textarea>
        <div class='text-slate-50 mx-auto w-fit mt-20 cursor-pointer'>
          <VsSend size={40} />
        </div>
      </div>

      <div class='w-2/5 border h-full'>
        <RefTagsSearchPanel tags={refTags()} addNostrTag={addNostrTag} removeNostrTag={removeNostrTag} />
      </div>
    </div>
  );
};

export default Write;
