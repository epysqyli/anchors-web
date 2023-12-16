import Popup from "./Popup";
import { A } from "solid-start";
import { nip19 } from "nostr-tools";
import { VsSave } from "solid-icons/vs";
import EventAuthor from "../feed/EventAuthor";
import { RelayContext } from "~/contexts/relay";
import OverlayContext from "~/contexts/overlay";
import LoadingPoints from "../feed/LoadingPoints";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import LoadingFallback from "../feed/LoadingFallback";
import { JSX, Show, VoidComponent, createEffect, createSignal, onMount, useContext } from "solid-js";

const UserIdentity: VoidComponent = (): JSX.Element => {
  const overlay = useContext(OverlayContext);
  const { relay, authMode, guestPublicKey, setupDone } = useContext(RelayContext);

  const [show, setShow] = createSignal<boolean>(false);
  const [initialLoad, setInitialLoad] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [inputPublicKey, setInputPublicKey] = createSignal<string>("");

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    let publicKey: string = inputPublicKey();

    if (inputPublicKey().startsWith('npub')) {
      const decodeResult = nip19.decode(inputPublicKey());
      publicKey = decodeResult.data as string;
    }

    localStorage.setItem(guestPublicKey.localStorageKey, publicKey);
    guestPublicKey.set(publicKey);
    setInputPublicKey("");
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
              <p>Your already set public key is:</p>
              <p class='font-bold mt-5 mx-auto'>{guestPublicKey.get()}</p>
            </>
          ) : (
            <>
              <p class='text-base'>
                You can set a public key to use a limited version of the app where no new events can be
                signed, (meaning that no new posts can be written, no reactions sent etc etc), but where
                following and relay lists are available
              </p>
            </>
          )}

          <form onsubmit={handleSubmit} class='flex items-center justify-between mt-10'>
            <input
              onchange={handleChange}
              type='text'
              value={inputPublicKey()}
              minlength={63}
              maxLength={64}
              required
              class='w-5/6 rounded focus:outline-none bg-slate-600 py-2 px-5
                       placeholder:text-base placeholder:text-center'
              placeholder={
                guestPublicKey.get() ? "update your public key" : "enter your public key"
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
      <p>No user metadata information was found your public key, in order to fix this you can either:</p>
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

    if (localStorage.getItem("anchors_initial_load") == "false") {
      setIsLoading(false);
      return;
    } else {
      setInitialLoad(true);
    }

    if (!relay.userPubKey) {
      guestPublicKey.set(localStorage.getItem(guestPublicKey.localStorageKey) ?? "");
    }

    setIsLoading(false);
  });

  createEffect(() => {
    if (show() && !overlay.showOverlay()) {
      overlay.toggleOverlay();
    }
  });

  createEffect(() => {
    if (initialLoad() && setupDone()) {
      setShow(true);
    }
  });

  const setInitialLoadToFalse = (): void => {
    localStorage.setItem("anchors_initial_load", "false");
  };

  return (
    <>
      <Show when={useIsNarrow() != undefined && useIsNarrow()}>
        <div class='absolute top-0 left-0 z-10'>
          <Popup autoClose={false} show={show} setShow={setShow} onCloseFunc={setInitialLoadToFalse}>
            <Show when={!isLoading()} fallback={<LoadingPoints />}>
              <div class='h-screen w-screen pt-20 bg-slate-800 bg-opacity-95'>
                {authMode.get() == "private" ? (
                  <div class='h-full'>
                    <EventAuthor
                      about={relay.userMetadata?.about ?? ""}
                      layout='v'
                      name={relay.userMetadata?.name ?? ""}
                      picture={relay.userMetadata?.picture ?? ""}
                      pubKey={relay.userPubKey!}
                    />
                    <p class='text-lg mt-5 font-bold'>Welcome to Anchors</p>
                    {relay.userMetadata != undefined ? undefinedMetadataSuggestions : <></>}
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
            show={show}
            setShow={setShow}
            onCloseFunc={setInitialLoadToFalse}
            largeHeight
          >
            <Show when={!isLoading()} fallback={<LoadingFallback />}>
              <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full'>
                {authMode.get() == "private" ? (
                  <div>
                    <EventAuthor
                      about={relay.userMetadata?.about ?? ""}
                      layout='v'
                      name={relay.userMetadata?.name ?? ""}
                      picture={relay.userMetadata?.picture ?? ""}
                      pubKey={relay.userPubKey!}
                    />
                    <p class='text-lg mt-5 font-bold'>Welcome to Anchors</p>
                    {relay.userMetadata == undefined ? undefinedMetadataSuggestions : <></>}
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
