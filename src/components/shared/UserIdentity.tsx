import Popup from "./Popup";
import { VsSave } from "solid-icons/vs";
import EventAuthor from "../feed/EventAuthor";
import { RelayContext } from "~/contexts/relay";
import OverlayContext from "~/contexts/overlay";
import { IUserMetadata } from "~/interfaces/IUserMetadata";
import { Accessor, Component, JSX, Setter, createEffect, createSignal, onMount, useContext } from "solid-js";

interface Props {
  initialLoad: Accessor<boolean>;
  setInitialLoad: Setter<boolean>;
}

const UserIdentity: Component<Props> = (props): JSX.Element => {
  const overlay = useContext(OverlayContext);
  const { relay, authMode, guestPublicKey } = useContext(RelayContext);
  const [userMetadata, setUserMetadata] = createSignal<IUserMetadata>();
  const [inputPublicKey, setInputPublicKey] = createSignal<string>("");
  const [privateKeyModeTemplate, setPrivateKeyModeTemplate] = createSignal<JSX.Element>(<></>);

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    localStorage.setItem(guestPublicKey.localStorageKey, inputPublicKey());
    guestPublicKey.set(inputPublicKey());
  };

  const handleChange = (e: Event): void => {
    setInputPublicKey((e.currentTarget as HTMLInputElement).value);
  };

  const guestModeTemplate: JSX.Element = (
    <div>
      <h2 class='text-xl mb-10 font-bold'>Welcome to Anchors</h2>
      <p class='underline underline-offset-4'>No key pair detected from Nostr compatible extensions</p>
      <p class='mt-5 mb-10 text-justify'>
        {guestPublicKey.get() ? (
          <p class='text-base text-left break-all'>
            Your guest public key is: <span class='font-bold'>{guestPublicKey.get()}</span>
          </p>
        ) : (
          <>
            <p class='text-base'>
              You can set a guest public key to use a limited version of the app where no new events can be
              signed, (meaning that no new posts can be written, no reactions sent etc etc), but where
              following and relay lists are available
            </p>

            <form onsubmit={handleSubmit} class='flex items-center justify-between mt-10'>
              <input
                onchange={handleChange}
                type='text'
                minlength={64}
                maxLength={64}
                class='w-5/6 rounded focus:outline-none bg-slate-600 py-2 px-5
                       placeholder:text-base placeholder:text-center'
                placeholder='enter your guest public key'
              />
              <button class='w-1/6 text-slate-300 group'>
                <VsSave class='mx-auto hover:text-slte-200 group-active:scale-95' size={30} />
              </button>
            </form>
          </>
        )}
      </p>
    </div>
  );

  onMount(async () => {
    if (!props.initialLoad()) {
      return;
    }

    guestPublicKey.set(localStorage.getItem(guestPublicKey.localStorageKey) ?? "");

    if (authMode.get() == "private") {
      setUserMetadata(await relay.fetchUserMetadata());

      setPrivateKeyModeTemplate(
        <div>
          <div>
            <EventAuthor
              about={userMetadata()!.about}
              layout='v'
              name={userMetadata()!.name}
              picture={userMetadata()!.picture}
              pubKey={relay.userPubKey!}
            />
          </div>
          <p class='text-lg mt-5 font-bold'>Welcome back to Anchors</p>
        </div>
      );
    }
  });

  createEffect(() => {
    if (props.initialLoad() && !overlay.showOverlay()) {
      overlay.toggleOverlay();
    }
  });

  return (
    <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 xl:w-1/2'>
      <Popup autoClose={false} show={props.initialLoad} setShow={props.setInitialLoad} largeHeight>
        <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full'>
          {authMode.get() == "private" ? privateKeyModeTemplate() : guestModeTemplate}
        </div>
      </Popup>
    </div>
  );
};

export default UserIdentity;
