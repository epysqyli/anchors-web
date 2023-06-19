import { VsReferences, VsSend } from "solid-icons/vs";
import { IRefTag } from "~/interfaces/IRefTag";
import { RelayContext } from "~/contexts/relay";
import { Component, Show, createSignal, useContext } from "solid-js";
import { Event as NostrEvent, EventTemplate, Kind, Pub } from "nostr-tools";
import RefTagsSearchPanel from "~/components/write/RefTagsSearchPanel";
import menuTogglerContext from "~/contexts/menuToggle";
import { Motion, Presence } from "@motionone/solid";

declare global {
  interface Window {
    nostr: {
      signEvent(unsignedEvent: EventTemplate): Promise<NostrEvent>;
    };
  }
}

const Write: Component<{}> = () => {
  const relay = useContext(RelayContext);
  const menuToggle = useContext(menuTogglerContext);

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
    menuToggle.toggleMenu();
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
    <div
      class='md:flex md:gap-x-2 xl:gap-x-2 2xl:w-[98%] mx-auto h-full md:h-[96vh] absolute w-[99%] 
                top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'
    >
      <div class='w-full md:w-3/5 rounded h-full md:border-slate-500 md:border-opacity-25 md:border'>
        <div class='h-[70%] md:h-[80%]'>
          <h1
            class='relative text-slate-100 text-center text-2xl md:text-4xl font-bold
                   border-b md:rounded-tr md:rounded-tl border-slate-500 h-[15%]'
          >
            <span class='absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              Write a new idea
            </span>
          </h1>
          <textarea
            placeholder='Time to connect the dots'
            class='block placeholder:text-center focus:outline-none w-11/12 md:w-3/4 mx-auto bg-transparent p-5 md:p-10
               text-slate-300 caret-orange-200 resize-none custom-scrollbar h-[85%]'
            rows={18}
            onInput={updateContent}
          ></textarea>
        </div>

        <div
          onClick={signAndPublishNostrEvent}
          class='hidden md:block relative text-slate-50 mx-auto py-10 group cursor-pointer border-t
               border-slate-500 border-opacity-25 h-[20%] hover:bg-slate-600'
        >
          <VsSend
            size={40}
            class='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2
                   group-hover:scale-110 group-active:scale-90 transition'
          />
        </div>

        <div class='md:hidden text-slate-50 h-[20%] flex items-center justify-around pt-5 '>
          <VsSend size={32} onClick={signAndPublishNostrEvent} />
          <div onClick={toggleRefMenu} class='relative active:scale-90 transition'>
            <VsReferences size={32} />
            <div class='absolute -top-3 -right-3'>{refTags().length}</div>
          </div>
        </div>
      </div>

      <div class='hidden md:block w-2/5 h-full border-slate-500 border-opacity-25 border'>
        <RefTagsSearchPanel
          tags={refTags()}
          addNostrTag={addNostrTag}
          removeNostrTag={removeNostrTag}
          toggleMenu={toggleRefMenu}
        />
      </div>

      <Presence exitBeforeEnter>
        <Show when={showRefMenu()}>
          <Motion.div
            class='fixed top-0 left-0 h-full w-full bg-slate-700'
            initial={{ scale: 1.05, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ easing: "ease-out" }}
            exit={{ scale: 1.05, opacity: 0 }}
          >
            <RefTagsSearchPanel
              tags={refTags()}
              addNostrTag={addNostrTag}
              removeNostrTag={removeNostrTag}
              toggleMenu={toggleRefMenu}
            />
          </Motion.div>
        </Show>
      </Presence>
    </div>
  );
};

export default Write;
