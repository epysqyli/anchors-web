import { Kind } from "nostr-tools";
import { FiSave } from "solid-icons/fi";
import { RelayContext } from "~/contexts/relay";
import { VoidComponent, createSignal, useContext } from "solid-js";

const UserMetadata: VoidComponent = () => {
  const relay = useContext(RelayContext);

  const [content, setContent] = createSignal<{ name: string; about: string; picture: string }>({
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
      console.log("ok");
    });

    pubResult.on("failed", () => {
      console.log("failed");
    });
  };

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
            onChange={handleChange}
            placeholder='url pointing to an avatar image'
            class='p-3 rounded text-center text-lg text-slate-200 caret-slate-200 bg-neutral-600 focus:outline-none w-full'
          />
        </div>

        <button class='block w-1/2 mt-16 mx-auto py-5 rounded bg-slate-500 group'>
          <FiSave
            class='text-slate-100 mx-auto group-hover:scale-110 group-active:scale-90 transition-transform'
            size={38}
          />
        </button>
      </form>
    </>
  );
};

export default UserMetadata;
