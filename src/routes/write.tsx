import { VsReferences, VsSend } from "solid-icons/vs";
import { IRefTag } from "~/interfaces/IRefTag";
import { RelayContext } from "~/contexts/relay";
import { Component, Show, createSignal, useContext } from "solid-js";
import { Event as NostrEvent, EventTemplate, Kind, Pub } from "nostr-tools";
import RefTagsSearchPanel from "~/components/write/RefTagsSearchPanel";
import menuTogglerContext from "~/contexts/menuToggle";
import { Motion, Presence } from "@motionone/solid";
import ActionPopup from "~/components/shared/ActionPopup";
import OverlayContext from "~/contexts/overlay";

const Write: Component<{}> = () => {
  const relay = useContext(RelayContext);
  const overlayContext = useContext(OverlayContext);
  const menuToggle = useContext(menuTogglerContext);

  const [refTags, setRefTags] = createSignal<IRefTag[]>([], { equals: false });
  const [nostrEvent, setNostrEvent] = createSignal<EventTemplate>(
    {
      content: "",
      created_at: Math.floor(Date.now() / 1000),
      kind: Kind.Text,
      tags: []
    },
    { equals: false }
  );

  const [popupMsg, setPopupMsg] = createSignal<string>("");
  const [isActionSuccessful, setIsActionSuccessful] = createSignal<boolean>(false);
  const [showActionPopup, setShowActionPopup] = createSignal<boolean>(false);
  const togglePopup = (): void => {
    setShowActionPopup(!showActionPopup());
    overlayContext.toggleOverlay();
  };

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
    if (window.nostr == undefined) {
      setIsActionSuccessful(false);
      setPopupMsg("A browser nostr extension is needed to sign events, but is currently not available");
      togglePopup();
      return false;
    }

    if (nostrEvent().content.trim().length == 0) {
      setIsActionSuccessful(false);
      setPopupMsg("There is no content, write something first :)");
      togglePopup();
      return false;
    }

    if (nostrEvent().tags.filter((tag) => tag[0] == "r").length == 0) {
      setIsActionSuccessful(false);
      setPopupMsg(`There are no references for this post: this idea must have originated somewhere though,
                   what could have prompted it? Let's connect the dots together!`);

      togglePopup();
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

  const signAndPublishNostrEvent = async (): Promise<void> => {
    if (!canPublish()) {
      return;
    }

    const signedEvent = await window.nostr.signEvent(nostrEvent());
    const pubResult: Pub = relay.publish(signedEvent);

    pubResult.on("ok", () => {
      setIsActionSuccessful(true);
      setPopupMsg("Post correctly published! Find it in your 'my posts' section");
      togglePopup();
    });

    pubResult.on("failed", () => {
      setIsActionSuccessful(false);
      setPopupMsg("Something did not work when publishing the post, please try again.");
      togglePopup();
    });
  };

  return (
    <>
      <div class='md:flex md:gap-x-2 xl:gap-x-2 2xl:w-[98%] mx-auto h-full md:h-[96vh] absolute w-[99%] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
        <div class='w-full md:w-3/5 h-full'>
          <div class='h-[70%] md:h-[80%]'>
            <h1
              class='relative text-slate-100 text-center text-2xl md:text-4xl font-bold
                   md:rounded-tr md:rounded-tl h-[15%]'
            >
              <span class='absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                Write a new idea
              </span>
            </h1>
            <textarea
              placeholder='Time to connect the dots'
              class='block placeholder:text-center placeholder:text-lg text-lg focus:outline-none w-11/12 md:w-3/4 mx-auto
                  bg-transparent p-5 md:p-10 text-slate-300 caret-orange-200 resize-none custom-scrollbar h-[85%]'
              rows={18}
              onInput={updateContent}
            ></textarea>
          </div>

          <div
            onClick={signAndPublishNostrEvent}
            class='hidden md:block relative text-orange-300 mx-auto py-10 group cursor-pointer h-[20%]
               md:h-[15%] md:w-2/3 md:mx-auto md:mt-5 hover:bg-slate-600 rounded-md'
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

        <div class='hidden md:block w-2/5 h-full md:py-5 md:my-auto md:bg-slate-800 md:rounded-md'>
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

      <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'>
        <ActionPopup
          message={popupMsg}
          show={showActionPopup}
          togglePopup={togglePopup}
          isActionSuccessful={isActionSuccessful}
        />
      </div>
    </>
  );
};

export default Write;
