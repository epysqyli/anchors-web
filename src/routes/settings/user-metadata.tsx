import { FiSave } from "solid-icons/fi";
import { CgDanger } from "solid-icons/cg";
import Popup from "~/components/shared/Popup";
import { RelayContext } from "~/contexts/relay";
import { IUserMetadata } from "~/interfaces/IUserMetadata";
import { Event as NostrEvent, Kind, Sub } from "nostr-tools";
import { RiSystemCheckboxCircleFill } from "solid-icons/ri";
import { createMetadataFilter } from "~/lib/nostr/nostr-utils";
import { VoidComponent, createSignal, onMount, useContext } from "solid-js";

const UserMetadata: VoidComponent = () => {
  const relayCtx = useContext(RelayContext);
  const relay = relayCtx.relay;
  const publicKey = relayCtx.publicKey;

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
      setShowPopup(true);
    });

    pubResult.on("failed", () => {
      setIsActionSuccessful(false);
      setShowPopup(true);
    });
  };

  const [showPopup, setShowPopup] = createSignal<boolean>(false);
  const [isActionSuccessful, setIsActionSuccessful] = createSignal<boolean>(false);

  onMount(() => {
    if (publicKey == "") {
      console.log("Your public key is not available");
      setIsActionSuccessful(false);
      return;
    }

    const metadataFilter = createMetadataFilter([publicKey]);
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
        <Popup show={showPopup} setShow={setShowPopup}>
          {isActionSuccessful() ? (
            <>
              <p>Nostr profile metadata successfully updated!</p>
              <RiSystemCheckboxCircleFill class='mx-auto mt-8' size={44} />
            </>
          ) : (
            <>
              <p>Request failed</p>
              <CgDanger class='mx-auto mt-8' size={44} />
            </>
          )}
        </Popup>
      </div>
    </>
  );
};

export default UserMetadata;
