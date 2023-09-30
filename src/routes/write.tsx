import { VsSend } from "solid-icons/vs";
import Popup from "~/components/shared/Popup";
import { IRefTag } from "~/interfaces/IRefTag";
import { RelayContext } from "~/contexts/relay";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import menuTogglerContext from "~/contexts/menuToggle";
import { Component, Show, createSignal, useContext } from "solid-js";
import RefTagsSearchPanel from "~/components/write/RefTagsSearchPanel";
import { Event as NostrEvent, EventTemplate, Kind, Pub } from "nostr-tools";

const Write: Component<{}> = () => {
  const { relay } = useContext(RelayContext);
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
  const [showPopup, setShowPopup] = createSignal<boolean>(false);

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
      setShowPopup(true);
      setPopupMsg("A browser nostr extension is needed to sign events, but is currently not available");
      return false;
    }

    if (nostrEvent().content.trim().length == 0) {
      setPopupMsg("There is no content, write something first");
      setShowPopup(true);
      return false;
    }

    if (nostrEvent().tags.filter((tag) => tag[0] == "r").length == 0) {
      setShowPopup(true);
      setPopupMsg(`There are no references for this post: this idea must have originated somewhere though!`);

      return false;
    }

    return true;
  };

  const addReferenceTag = (nostrTag: IRefTag): void => {
    const newNostrEvent = nostrEvent();
    newNostrEvent.tags = [...nostrEvent().tags, ["r", nostrTag.url]];
    setNostrEvent(newNostrEvent);

    const newRefTags = [...refTags(), nostrTag];
    setRefTags(newRefTags);
  };

  const removeReferenceTag = (nostrTag: IRefTag): void => {
    const indexOfTagToRemove = nostrEvent().tags.findIndex((t) => t[1] === nostrTag.url);

    const currentTags = nostrEvent().tags;
    currentTags.splice(indexOfTagToRemove, 1);
    const newNostrEvent = nostrEvent();
    newNostrEvent.tags = currentTags;
    setNostrEvent(newNostrEvent);

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
    const pubResult: Pub = relay.pub(signedEvent);

    pubResult.on("ok", () => {
      setShowPopup(true);
      setPopupMsg("Post correctly published! Find it in your 'my posts' section");
    });

    pubResult.on("failed", () => {
      setShowPopup(true);
      setPopupMsg("Something did not work when publishing the post, please try again.");
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
            <div class='flex flex-col justify-between py-10 col-span-4 rounded-md bg-slate-600 bg-opacity-10'>
              <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold'>Write a new idea</h1>
              <textarea
                placeholder='Time to connect the dots'
                class='block w-4/5 2xl:w-2/3 placeholder:text-center placeholder:text-lg text-lg focus:outline-none bg-transparent
                     mx-auto text-slate-300 caret-orange-200 resize-none custom-scrollbar px-5 py-2'
                rows={14}
                onInput={updateContent}
              ></textarea>

              <div
                onClick={signAndPublishNostrEvent}
                class=' text-orange-300 mx-auto py-12 group cursor-pointer hover:bg-slate-600 rounded-md w-4/5'
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
                addReferenceTag={addReferenceTag}
                removeReferenceTag={removeReferenceTag}
                toggleMenu={toggleRefMenu}
              />
            </div>
          </div>

          <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 xl:w-1/3'>
            <Popup autoClose={true} show={showPopup} setShow={setShowPopup}>
              <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full'>
                {popupMsg()}
              </div>
            </Popup>
          </div>
        </>
      </Show>
    </>
  );
};

export default Write;
