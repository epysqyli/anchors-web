import { VsSend } from "solid-icons/vs";
import { IRefTag } from "~/interfaces/IRefTag";
import { RelayContext } from "~/contexts/relay";
import OverlayContext from "~/contexts/overlay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import menuTogglerContext from "~/contexts/menuToggle";
import ActionPopup from "~/components/shared/ActionPopup";
import { Component, Show, createSignal, useContext } from "solid-js";
import RefTagsSearchPanel from "~/components/write/RefTagsSearchPanel";
import { Event as NostrEvent, EventTemplate, Kind, Pub } from "nostr-tools";

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
      <Show when={useIsNarrow() !== undefined && useIsNarrow()}>
        <> ... </>
      </Show>

      <Show when={useIsNarrow() !== undefined && !useIsNarrow()}>
        <>
          <div class='grid grid-cols-7 gap-x-2 h-full w-[99%] mx-auto'>
            <div class='col-span-4 rounded-md bg-slate-600 bg-opacity-10'>
              <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold py-10'>
                Write a new idea
              </h1>
              <textarea
                placeholder='Time to connect the dots'
                class='block w-4/5 2xl:w-2/3 placeholder:text-center placeholder:text-lg text-lg focus:outline-none bg-transparent
                     mx-auto text-slate-300 caret-orange-200 resize-none custom-scrollbar px-5 py-2'
                rows={14}
                onInput={updateContent}
              ></textarea>

              <div
                onClick={signAndPublishNostrEvent}
                class=' text-orange-300 mx-auto py-12 group cursor-pointer hover:bg-slate-600 rounded-md mt-20 w-4/5'
              >
                <VsSend
                  size={40}
                  class='w-fit mx-auto group-hover:scale-110 group-active:scale-90 transition'
                />
              </div>
            </div>

            <div class='col-span-3 rounded-md bg-slate-800 bg-opacity-80 h-full py-4 overflow-y-auto'>
              <RefTagsSearchPanel
                tags={refTags()}
                addNostrTag={addNostrTag}
                removeNostrTag={removeNostrTag}
                toggleMenu={toggleRefMenu}
              />
            </div>
          </div>

          <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 xl:w-1/3'>
            <ActionPopup
              message={popupMsg}
              show={showActionPopup}
              togglePopup={togglePopup}
              isActionSuccessful={isActionSuccessful}
            />
          </div>
        </>
      </Show>
    </>
  );
};

export default Write;
