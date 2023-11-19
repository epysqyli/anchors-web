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
import { useIsNarrow } from "~/hooks/useMediaQuery";
import LoadingPoints from "../feed/LoadingPoints";
import { A } from "solid-start";

interface Props {
  initialLoad: Accessor<boolean>;
  setInitialLoad: Setter<boolean>;
}

const UserIdentity: Component<Props> = (props): JSX.Element => {
  const overlay = useContext(OverlayContext);
  const { relay, authMode, guestPublicKey } = useContext(RelayContext);
  const [userMetadata, setUserMetadata] = createSignal<IUserMetadata>();
  const [inputPublicKey, setInputPublicKey] = createSignal<string>("");
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
        <div class='text-base text-left break-words w-3/4 mx-auto mt-10'>
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

  const undefinedMetadataSuggestions: JSX.Element = (
    <div class='text-left mx-auto w-5/6 xl:w-4/5 mt-10'>
      <p>No user account was found, you can either:</p>
      <ul class='list-disc mt-3 pl-5'>
        <li class='underline underline-offset-4 mb-2'>
          <A href='/settings/user-metadata'>add user metadata to your nostr identity</A>
        </li>
        <li class='underline underline-offset-4'>
          <A href='/settings/manage-relays'>add the relay(s) where it can be fetched from</A>
        </li>
      </ul>
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
      const userMetadataResult = await relay.fetchUserMetadata();
      if (userMetadataResult) {
        setUserMetadata(userMetadataResult!);
      }
    }

    setIsLoading(false);
  });

  createEffect(() => {
    if (props.initialLoad() && !overlay.showOverlay()) {
      overlay.toggleOverlay();
    }
  });

  const setInitialLoadToFalse = (): void => {
    localStorage.setItem("anchors_initial_load", "false");
    props.setInitialLoad(false);
  };

  return (
    <>
      <Show when={useIsNarrow() != undefined && useIsNarrow()}>
        <div class='absolute top-0 left-0 z-10'>
          <Popup
            autoClose={false}
            show={props.initialLoad}
            setShow={props.setInitialLoad}
            onCloseFunc={setInitialLoadToFalse}
          >
            <Show when={!isLoading()} fallback={<LoadingPoints />}>
              <div class='h-screen w-screen pt-20 bg-slate-800 bg-opacity-95'>
                {authMode.get() == "private" ? (
                  <div class='h-full'>
                    <EventAuthor
                      about={userMetadata()?.about ?? ""}
                      layout='v'
                      name={userMetadata()?.name ?? ""}
                      picture={userMetadata()?.picture ?? ""}
                      pubKey={relay.userPubKey!}
                    />
                    <p class='text-lg mt-5 font-bold'>Welcome to Anchors</p>
                    {userMetadata() == undefined ? undefinedMetadataSuggestions : <></>}
                  </div>
                ) : (
                  guestModeTemplate
                )}
              </div>
            </Show>
          </Popup>
        </div>
      </Show>

      <Show when={useIsNarrow() != undefined && !useIsNarrow()}>
        <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 xl:w-1/2'>
          <Popup
            autoClose={false}
            show={props.initialLoad}
            setShow={props.setInitialLoad}
            onCloseFunc={setInitialLoadToFalse}
            largeHeight
          >
            <Show when={!isLoading()} fallback={<LoadingFallback />}>
              <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full'>
                {authMode.get() == "private" ? (
                  <div>
                    <EventAuthor
                      about={userMetadata()?.about ?? ""}
                      layout='v'
                      name={userMetadata()?.name ?? ""}
                      picture={userMetadata()?.picture ?? ""}
                      pubKey={relay.userPubKey!}
                    />
                    <p class='text-lg mt-5 font-bold'>Welcome to Anchors</p>
                    {userMetadata() == undefined ? undefinedMetadataSuggestions : <></>}
                  </div>
                ) : (
                  guestModeTemplate
                )}
              </div>
            </Show>
          </Popup>
        </div>
      </Show>
    </>
  );
};

export default UserIdentity;
