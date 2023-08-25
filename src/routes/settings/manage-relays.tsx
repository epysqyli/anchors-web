import { RelayContext } from "~/contexts/relay";
import { Kind, Event as NostrEvent, Pub, Sub, UnsignedEvent } from "nostr-tools";
import { fetchUserKindThreeEvent } from "~/lib/nostr/nostr-nips-actions";
import { For, JSX, VoidComponent, createSignal, onMount, useContext } from "solid-js";

const ManageRelays: VoidComponent = (): JSX.Element => {
  const { relay, publicKey, defaultRelay } = useContext(RelayContext);

  const [relays, setRelays] = createSignal<string[]>([]);
  const [eventKindThree, setEventKindThree] = createSignal<NostrEvent>();
  const [relayToAdd, setRelayToAdd] = createSignal<string>("");

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

    if (!relayToAdd().includes("ws") || !relayToAdd().includes("wss")) {
      console.log("not a valid websocket address");
      return;
    }

    setRelays([...relays(), relayToAdd()]);
    await publishEvent();
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
  }

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold mt-14'>
        Manage relays you fetch events from
      </h1>

      <div class='border rounded-md border-slate-400 w-2/5 mx-auto mt-20 p-5'>
        <For each={relays()}>
          {(relay) => (
            <div class='flex items-center justify-between'>
              <div class='text-slate-300'>{relay}</div>
              <div onClick={() => removeRelay(relay)}>delete relay</div>
            </div>
          )}
        </For>

        <form onSubmit={handleSubmit} class='flex items-center justify-between mt-10'>
          <input
            type='text'
            onChange={handleChange}
            class='block outline-none bg-transparent border-b pb-2 text-slate-200 
                  text-center caret-slate-200 placeholder:text-center'
            placeholder='add relay url'
          />
          <button>add relay</button>
        </form>
      </div>
    </>
  );
};

export default ManageRelays;
