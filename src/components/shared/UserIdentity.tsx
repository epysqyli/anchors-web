import Popup from "./Popup";
import { VsSave } from "solid-icons/vs";
import EventAuthor from "../feed/EventAuthor";
import { RelayContext } from "~/contexts/relay";
import OverlayContext from "~/contexts/overlay";
import { IUserMetadata } from "~/interfaces/IUserMetadata";
import {
  Accessor,
  Component,
  JSX,
  Setter,
  Show,
  createEffect,
  createSignal,
  onMount,
  useContext
} from "solid-js";
import LoadingFallback from "../feed/LoadingFallback";

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
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

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
      <h2 class='text-2xl mb-10 font-bold'>Welcome to Anchors</h2>
      <p class='underline underline-offset-4'>No key pair detected from Nostr compatible extensions</p>
      <div class='mt-5 mb-10 text-justify'>
        <div class='text-base text-left break-all w-3/4 mx-auto mt-10'>
          {guestPublicKey.get() ? (
            <>
              <p>Your already set guest public key is:</p>
              <p class='font-bold mt-5 mx-auto'>{guestPublicKey.get()}</p>
            </>
          ) : (
            <>
              <p class='text-base'>
                You can set a guest public key to use a limited version of the app where no new events can be
                signed, (meaning that no new posts can be written, no reactions sent etc etc), but where
                following and relay lists are available
              </p>
            </>
          )}

          <form onsubmit={handleSubmit} class='flex items-center justify-between mt-10'>
            <input
              onchange={handleChange}
              type='text'
              minlength={64}
              maxLength={64}
              required
              class='w-5/6 rounded focus:outline-none bg-slate-600 py-2 px-5
                       placeholder:text-base placeholder:text-center'
              placeholder={
                guestPublicKey.get() ? "update your guest public key" : "enter your guest public key"
              }
            />
            <button class='w-1/6 text-slate-300 group'>
              <VsSave class='mx-auto hover:text-slte-200 group-active:scale-95' size={30} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  onMount(async () => {
    setIsLoading(true);
    if (!props.initialLoad()) {
      setIsLoading(false);
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

    setIsLoading(false);
  });

  createEffect(() => {
    if (props.initialLoad() && !overlay.showOverlay()) {
      overlay.toggleOverlay();
    }
  });

  return (
    <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 xl:w-1/2'>
      <Popup autoClose={false} show={props.initialLoad} setShow={props.setInitialLoad} largeHeight>
        <Show when={!isLoading()} fallback={<LoadingFallback />}>
          <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full'>
            {authMode.get() == "private" ? privateKeyModeTemplate() : guestModeTemplate}
          </div>
        </Show>
      </Popup>
    </div>
  );
};

export default UserIdentity;
