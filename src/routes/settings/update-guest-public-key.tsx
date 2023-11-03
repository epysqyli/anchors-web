import { VsSave } from "solid-icons/vs";
import { RelayContext } from "~/contexts/relay";
import { JSX, VoidComponent, createSignal, useContext } from "solid-js";
import { A } from "solid-start";

const UpdateGuestPublicKey: VoidComponent = (): JSX.Element => {
  const { guestPublicKey } = useContext(RelayContext);

  const [inputPublicKey, setInputPublicKey] = createSignal<string>("");

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    localStorage.setItem(guestPublicKey.localStorageKey, inputPublicKey());
    guestPublicKey.set(inputPublicKey());
  };

  const handleChange = (e: Event): void => {
    setInputPublicKey((e.currentTarget as HTMLInputElement).value);
  };

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold my-14'>
        Update your guest public key
      </h1>

      <div class='xl:w-4/5 2xl:w-3/5 mx-auto h-4/5 overflow-y-scroll custom-scrollbar px-10'>
        <div class='text-lg text-slate-300'>
          {guestPublicKey.get() ? (
            <div>
              <p>Your current guest public key is:</p>
              <p class='mt-2 font-bold'>{guestPublicKey.get()}</p>
            </div>
          ) : (
            <p>You have not yet set a guest publc key</p>
          )}

          <form onsubmit={handleSubmit} class='flex items-center justify-between my-16 mx-auto'>
            <input
              onchange={handleChange}
              type='text'
              minlength={64}
              maxLength={64}
              required
              class='w-5/6 rounded focus:outline-none bg-slate-600 py-3 px-5 text-slate-200
          placeholder:text-base placeholder:text-center caret-slate-200 text-center'
              placeholder={
                guestPublicKey.get() ? "update your guest public key" : "enter your guest public key"
              }
            />
            <button class='w-1/6 text-slate-300 group'>
              <VsSave class='mx-auto hover:text-slte-200 group-active:scale-95' size={30} />
            </button>
          </form>

          <h3 class='text-xl mt-5 mb-2 underline underline-offset-4'>No guest public key mode</h3>
          <p class='mb-5 text-justify'>
            Not having set a guest public key means that a very limited experience of Anchors is available, as
            no personal preferences whatsoever are taken into account.
          </p>

          <h3 class='text-xl mt-5 mb-2 underline underline-offset-4'>Guest public key mode</h3>
          <p class='mb-5 text-justify'>
            Setting a guest public, on the other hand, allows a personalized experience with no interactions:
            followers and relays are available, but since the private key is not available, no new posts can
            be written, nor reactions or comments sent, as events cannot be signed (see
            <A
              class='italic underline'
              target='_blank'
              href='https://github.com/nostr-protocol/nips/blob/master/01.md'
            >
              nostr protocol NIP-01
            </A>
            ).
          </p>

          <h3 class='text-xl mt-5 mb-2 underline underline-offset-4'>Private key mode</h3>
          <p class='mb-5 text-justify'>
            In order to have the full Nostr experience, a private key is needed. Since saving it directly on
            the client is not secure, there exists several browser extensions that allow targeted access to
            the private key.
          </p>
        </div>
      </div>
    </>
  );
};

export default UpdateGuestPublicKey;