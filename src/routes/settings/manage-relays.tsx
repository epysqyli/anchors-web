import { RelayContext } from "~/contexts/relay";
import { Kind, Event as NostrEvent, Pub, Sub, UnsignedEvent } from "nostr-tools";
import { fetchUserKindThreeEvent } from "~/lib/nostr/nostr-relay-calls";
import { For, JSX, VoidComponent, createSignal, onMount, useContext } from "solid-js";

const ManageRelays: VoidComponent = (): JSX.Element => {
  const { relay, publicKey, defaultRelay } = useContext(RelayContext);

  const [relays, setRelays] = createSignal<string[]>([]);
  const [eventKindThree, setEventKindThree] = createSignal<NostrEvent>();
  const [relayToAdd, setRelayToAdd] = createSignal<string>("");
  const [validationError, setValidationError] = createSignal<boolean>(false);
  const [placeholder, setPlaceholder] = createSignal<string>("add a relay");

  onMount(async () => {
    const kindThreeEvent = await fetchUserKindThreeEvent(relay, publicKey);
    setEventKindThree(kindThreeEvent);

    const currentRelays: string[] = kindThreeEvent.content.split(";").filter((el) => el != "");

    if (currentRelays.length == 0) {
      currentRelays.push(defaultRelay);
    }

    setRelays(currentRelays);
  });

  const handleChange = (e: Event): void => {
    setRelayToAdd((e.currentTarget as HTMLInputElement).value);
  };

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault();

    if (!relayToAdd().startsWith("ws") || !relayToAdd().startsWith("wss")) {
      setValidationError(true);
      setPlaceholder("relay address is not valid");
      return;
    }

    setValidationError(false);
    setPlaceholder("add a relay");

    setRelays([...relays(), relayToAdd()]);
    await publishEvent();
    setRelayToAdd("");
  };

  const removeRelay = async (relayUrl: string): Promise<void> => {
    setRelays(relays().filter((r) => r !== relayUrl));
    await publishEvent();
  };

  const publishEvent = async (): Promise<void> => {
    const updatedKindThreeEvent: UnsignedEvent = {
      content: relays().join(";"),
      created_at: Math.floor(Date.now() / 1000),
      kind: Kind.Contacts,
      pubkey: publicKey,
      tags: eventKindThree()!.tags
    };

    const signedEvent = await window.nostr.signEvent(updatedKindThreeEvent);

    const pub: Pub = relay.publish(signedEvent);

    pub.on("ok", () => {
      setEventKindThree(signedEvent);
      console.log("ok");
    });

    pub.on("failed", () => console.log("failed"));
  };

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold mt-14'>
        Manage relays you fetch events from
      </h1>

      <div class='flex flex-col justify-between bg-slate-700 rounded-md w-3/5 mx-auto mt-10 py-5 px-10 h-2/3'>
        <div class='grow-1 overflow-y-scroll custom-scrollbar'>
          <For each={relays()}>
            {(relay) => (
              <div class='flex items-center justify-between my-4 pb-4 px-1 border-b border-slate-500'>
                <div class='text-slate-200'>{relay}</div>
                <div
                  onClick={() => removeRelay(relay)}
                  class='text-sm bg-red-400 bg-opacity-40 hover:bg-opacity-100 cursor-pointer 
                rounded p-2 text-slate-400 active:scale-95 select-none'
                >
                  delete
                </div>
              </div>
            )}
          </For>
        </div>

        <form onSubmit={handleSubmit} class='flex items-center justify-between mt-10'>
          <input
            type='text'
            value={relayToAdd()}
            onChange={handleChange}
            class={`block outline-none bg-transparent border-slate-200 border-b border-opacity-75
                  focus:border-opacity-100 py-2 text-slate-200 
                  text-center caret-slate-200 placeholder:text-center
                  ${validationError() ? "border rounded border-red-600" : ""}`}
            placeholder={placeholder()}
          />
          <button class='px-5 p-2 bg-green-200 text-green-800 rounded-md active:scale-95 select-none'>
            add
          </button>
        </form>
      </div>
    </>
  );
};

export default ManageRelays;
