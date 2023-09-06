import { RelayContext } from "~/contexts/relay";
import { Kind, Event as NostrEvent, Pub, UnsignedEvent } from "nostr-tools";
import { For, JSX, Show, VoidComponent, createSignal, onMount, useContext } from "solid-js";
import LoadingFallback from "~/components/feed/LoadingFallback";

const ManageRelays: VoidComponent = (): JSX.Element => {
  const { relay } = useContext(RelayContext);

  const [relays, setRelays] = createSignal<string[]>([]);
  const [eventKindThree, setEventKindThree] = createSignal<NostrEvent>();
  const [relayToAdd, setRelayToAdd] = createSignal<string>("");
  const [validationError, setValidationError] = createSignal<boolean>(false);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  onMount(async () => {
    setIsLoading(true);
    const kindThreeEvent = await relay.fetchFollowingAndRelays();

    if (kindThreeEvent) {
      setEventKindThree(kindThreeEvent);

      if (kindThreeEvent.content == "") {
        setRelays(relay.relaysUrls);
      } else {
        setRelays(kindThreeEvent.content.split(";").filter((el) => el != ""));
      }
    }

    setIsLoading(false);
  });

  const handleChange = (e: Event): void => {
    setRelayToAdd((e.currentTarget as HTMLInputElement).value);
  };

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault();

    if (!relayToAdd().startsWith("ws")) {
      setValidationError(true);
      return;
    }

    setValidationError(false);

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
      pubkey: relay.userPubKey!,
      tags: eventKindThree()!.tags
    };

    const signedEvent = await window.nostr.signEvent(updatedKindThreeEvent);
    const pub: Pub = relay.pub(signedEvent, [relay.relaysUrls[0]]);

    pub.on("ok", () => {
      setEventKindThree(signedEvent);
      relay.relaysUrls = signedEvent.content.split(";").filter((el) => el != "");
      console.log("ok");
    });

    pub.on("failed", () => console.log("failed"));
  };

  // TODO: manage read, write, and read-write relays
  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold mt-14'>
        Manage relays you fetch events from
      </h1>

      <div class='flex flex-col justify-between bg-slate-700 rounded-md w-3/5 mx-auto mt-10 py-5 px-10 h-2/3'>
        <Show when={!isLoading()} fallback={<LoadingFallback />}>
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

          <form onSubmit={handleSubmit} class='flex items-center justify-between mb-3'>
            <input
              type='text'
              value={relayToAdd()}
              onChange={handleChange}
              class='block outline-none bg-transparent border-slate-200 border-b border-opacity-75
                  focus:border-opacity-100 py-2 text-slate-200 
                  text-center caret-slate-200 placeholder:text-center'
              placeholder='add a relay url'
            />

            {validationError() ? (
              <div class='bg-red-500 bg-opacity-25 text-center rounded-md px-5 border-slate-500 text-slate-300 w-1/3'>
                relay url should begin with 'ws' or 'wss'
              </div>
            ) : (
              <></>
            )}

            <button class='px-5 p-2 bg-green-200 text-green-800 rounded-md active:scale-95 select-none'>
              add
            </button>
          </form>
        </Show>
      </div>
    </>
  );
};

export default ManageRelays;
