import { useSearchParams } from "solid-start";
import Popup from "~/components/shared/Popup";
import { RelayContext } from "~/contexts/relay";
import { VsReferences, VsSend } from "solid-icons/vs";
import menuTogglerContext from "~/contexts/menuToggle";
import { IRefTag, RefTagCategory } from "~/interfaces/IRefTag";
import RefTagsSearchPanel from "~/components/write/RefTagsSearchPanel";
import { Event as NostrEvent, EventTemplate, Kind, Pub } from "nostr-tools";
import { Component, Show, createEffect, createSignal, onMount, useContext } from "solid-js";
import { useIsNarrow } from "~/hooks/useMediaQuery";

const Write: Component<{}> = () => {
  const { relay } = useContext(RelayContext);
  const menuToggle = useContext(menuTogglerContext);
  const LOCAL_STORAGE_CONTENT_KEY = "current-nostr-post-content";
  const LOCAL_STORAGE_REFTAGS_KEY = "current-nostr-post-reftags";

  const [incomingRefParams] = useSearchParams<{
    preview: string;
    primaryInfo: string;
    url: string;
    category: string;
  }>();

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
  const toggleBetweenWriteAndRefs = (): void => {
    menuToggle.toggleMenuButton();
    setShowRefMenu(!showRefMenu());
  };

  const updateContent = (e: Event) => {
    const textAreaContent = (e.currentTarget as HTMLInputElement).value;
    setNostrEvent({ ...nostrEvent(), content: textAreaContent });
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
    setNostrEvent({ ...nostrEvent(), tags: [...nostrEvent().tags, ["r", nostrTag.url]] });
    setRefTags([...refTags(), nostrTag]);
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

    const newNostrEvent = nostrEvent();
    newNostrEvent.tags = [...nostrEvent().tags, ["r", relay.ANCHORS_EVENT_RTAG_IDENTIFIER]];
    setNostrEvent(newNostrEvent);

    const signedEvent = await window.nostr.signEvent(nostrEvent());
    const pubResult: Pub = relay.pub(signedEvent);

    pubResult.on("ok", () => {
      setShowPopup(true);
      setPopupMsg("Post correctly published! Find it in your 'my posts' section");
      localStorage.removeItem(LOCAL_STORAGE_CONTENT_KEY);
      localStorage.removeItem(LOCAL_STORAGE_REFTAGS_KEY);
    });

    pubResult.on("failed", () => {
      setShowPopup(true);
      setPopupMsg("Something did not work when publishing the post, please try again.");
    });
  };

  onMount(() => {
    const content = localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);
    if (content != "undefined" && content != null) {
      setNostrEvent({ ...nostrEvent(), content: content });
    }

    const localStorageRefTags: IRefTag[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REFTAGS_KEY)!);

    if (localStorageRefTags?.flat()) {
      setRefTags([...refTags(), ...localStorageRefTags]);
      setNostrEvent({
        ...nostrEvent(),
        tags: [...nostrEvent().tags, ...localStorageRefTags.map((rt) => ["r", rt.url])]
      });
    }

    if (incomingRefParams.url) {
      const refTagAlreadyPresent = refTags().find((rt) => rt.url == incomingRefParams.url);

      if (!refTagAlreadyPresent) {
        setRefTags([
          ...refTags(),
          {
            title: incomingRefParams.primaryInfo,
            category: incomingRefParams.category as RefTagCategory,
            url: incomingRefParams.url,
            preview: incomingRefParams.preview,
            additionalInfoOne: "",
            additionalInfoTwo: ""
          }
        ]);

        setNostrEvent({ ...nostrEvent(), tags: [...nostrEvent().tags, ["r", incomingRefParams.url]] });
      }
    }
  });

  createEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, nostrEvent().content);
    localStorage.setItem(LOCAL_STORAGE_REFTAGS_KEY, JSON.stringify(refTags()));
  });

  return (
    <>
      <div class='grid grid-cols-1 xl:grid-cols-7 gap-x-2 h-[100dvh] xl:h-full mx-auto xl:pr-2'>
        <div
          class={`${showRefMenu() ? "hidden" : ""} flex flex-col justify-between py-10 xl:col-span-4 
                                                       rounded-md bg-slate-600 bg-opacity-10`}
        >
          <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold'>Write a new idea</h1>

          <textarea
            placeholder='Time to connect the dots'
            class='block w-4/5 2xl:w-2/3 placeholder:text-center placeholder:text-lg text-lg
                       focus:outline-none bg-transparent mx-auto text-slate-300
                       caret-orange-200 resize-none xl:custom-scrollbar px-5 py-2'
            rows={14}
            onInput={updateContent}
            value={nostrEvent().content}
          ></textarea>

          <div class='flex items-center justify-around xl:block'>
            <div
              onClick={signAndPublishNostrEvent}
              class='text-orange-300 mx-auto py-12 group cursor-pointer hover:bg-slate-600 rounded-md w-4/5'
            >
              <VsSend
                size={40}
                class='w-fit mx-auto group-hover:scale-110 group-active:scale-90 transition'
              />
            </div>
            <div
              onClick={toggleBetweenWriteAndRefs}
              class='xl:hidden relative text-slate-300 mx-auto py-12 group cursor-pointer hover:bg-slate-600 rounded-md w-4/5'
            >
              <VsReferences
                size={40}
                class='w-fit mx-auto group-hover:scale-110 group-active:scale-90 transition'
              />
              <span class='absolute top-7 right-16'>{refTags().length}</span>
            </div>
          </div>
        </div>

        <div
          class={`${showRefMenu() ? "" : "hidden"} xl:block xl:col-span-3 rounded-md bg-slate-800 
                                                       bg-opacity-80 h-full xl:py-4 overflow-y-auto 2xl:px-10`}
        >
          <RefTagsSearchPanel
            tags={refTags()}
            addReferenceTag={addReferenceTag}
            removeReferenceTag={removeReferenceTag}
            toggleBetweenWriteAndRefs={toggleBetweenWriteAndRefs}
          />
        </div>
      </div>

      <Show when={useIsNarrow() != undefined && useIsNarrow()}>
        <div class='absolute top-0 left-0 z-10'>
          <Popup autoClose={false} show={showPopup} setShow={setShowPopup}>
            <div class='h-screen w-screen pt-20 bg-slate-800 bg-opacity-95'>
              <div class="w-4/5 mx-auto">{popupMsg()}</div>
            </div>
          </Popup>
        </div>
      </Show>

      <Show when={useIsNarrow() != undefined && !useIsNarrow()}>
        <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 xl:w-1/3'>
          <Popup autoClose={true} show={showPopup} setShow={setShowPopup}>
            <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full'>{popupMsg()}</div>
          </Popup>
        </div>
      </Show>
    </>
  );
};

export default Write;
