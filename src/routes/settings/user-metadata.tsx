import { FiSave } from "solid-icons/fi";
import { useIsRouting } from "solid-start";
import { Event as NostrEvent, Kind, Sub } from "nostr-tools";
import { RelayContext } from "~/contexts/relay";
import { IUserMetadata } from "~/interfaces/IUserMetadata";
import { createMetadataFilter } from "~/lib/nostr/nostr-utils";
import { VoidComponent, createSignal, onMount, useContext } from "solid-js";
import ActionPopup from "~/components/shared/ActionPopup";
import OverlayContext from "~/contexts/overlay";

const UserMetadata: VoidComponent = () => {
  const relay = useContext(RelayContext);
  const overlayContext = useContext(OverlayContext);

  const [content, setContent] = createSignal<IUserMetadata>({
    name: "",
    about: "",
    picture: ""
  });

  const handleChange = (e: Event): void => {
    const eventTarget = e.currentTarget as HTMLInputElement;
    setContent({ ...content(), [eventTarget.name]: eventTarget.value });
  };

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault();

    const nostrEvent = {
      content: JSON.stringify(content()),
      created_at: Math.floor(Date.now() / 1000),
      kind: Kind.Metadata,
      tags: []
    };

    const signedEvent = await window.nostr.signEvent(nostrEvent);

    const pubResult = relay.publish(signedEvent);

    pubResult.on("ok", () => {
      setIsActionSuccessful(true);
      setPopupMsg("Profile info updated!");
      togglePopup();
    });

    pubResult.on("failed", () => {
      setIsActionSuccessful(false);
      setPopupMsg("Something did not work when publishing the post, please try again.");
      togglePopup();
    });
  };

  const [popupMsg, setPopupMsg] = createSignal<string>("");
  const [isActionSuccessful, setIsActionSuccessful] = createSignal<boolean>(false);
  const [showActionPopup, setShowActionPopup] = createSignal<boolean>(false);
  const togglePopup = (): void => {
    setShowActionPopup(!showActionPopup());
    overlayContext.toggleOverlay();
  };

  onMount(async () => {
    let pk = "";

    if (!useIsRouting()()) {
      try {
        pk = await window.nostr.getPublicKey();
      } catch (error) {
        await new Promise((_) => setTimeout(_, 500));
        pk = await window.nostr.getPublicKey();
      }
    }

    const metadataFilter = createMetadataFilter([pk]);
    const metaDataSub: Sub = relay.sub([metadataFilter]);

    metaDataSub.on("event", (event: NostrEvent) => {
      const userMetadata: IUserMetadata = JSON.parse(event.content);
      setContent(userMetadata);
    });
  });

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold my-14'>
        Update your profile info
      </h1>

      <form onSubmit={handleSubmit} class='mx-auto w-1/2 md:w-2/5'>
        <div class='py-3 px-5 mb-10'>
          <label class='text-slate-200 text-lg select-none text-center block mb-3 p-2 rounded bg-slate-600 w-1/3'>
            name
          </label>
          <input
            type='text'
            name='name'
            value={content().name}
            onChange={handleChange}
            placeholder='enter your nostr name to show to other users'
            class='p-3 rounded text-center text-lg text-slate-200 caret-slate-200 bg-neutral-600 focus:outline-none w-full'
          />
        </div>

        <div class='py-3 px-5 mb-10'>
          <label class='text-slate-200 text-lg select-none text-center block mb-3 p-2 rounded bg-slate-600 w-1/3'>
            about
          </label>
          <input
            type='text'
            name='about'
            value={content().about}
            onChange={handleChange}
            placeholder='something about yourself'
            class='p-3 rounded text-center text-lg text-slate-200 caret-slate-200 bg-neutral-600 focus:outline-none w-full'
          />
        </div>

        <div class='py-3 px-5'>
          <label class='text-slate-200 text-lg select-none text-center block mb-3 p-2 rounded bg-slate-600 w-1/3'>
            picture
          </label>
          <input
            type='text'
            name='picture'
            value={content().picture}
            onChange={handleChange}
            placeholder='url pointing to an avatar image'
            class='p-3 rounded text-center text-lg text-slate-200 caret-slate-200 bg-neutral-600 focus:outline-none w-full'
          />
        </div>

        <button class='block w-fit px-10 mt-16 mx-auto py-5 rounded-md bg-slate-600 group'>
          <FiSave
            class='text-slate-100 mx-auto group-hover:scale-110 group-active:scale-90 transition-transform'
            size={38}
          />
        </button>
      </form>

      <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 xl:w-1/3'>
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

export default UserMetadata;
