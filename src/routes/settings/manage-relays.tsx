import { TbPlus } from "solid-icons/tb";
import RelayList from "~/interfaces/RelayList";
import { RelayContext } from "~/contexts/relay";
import { EventTemplate, Kind, Pub } from "nostr-tools";
import { RiSystemCloseCircleFill } from "solid-icons/ri";
import LoadingPoints from "~/components/feed/LoadingPoints";
import { For, JSX, Show, VoidComponent, createSignal, onMount, useContext } from "solid-js";

const ManageRelays: VoidComponent = (): JSX.Element => {
  const { relay, readRelays } = useContext(RelayContext);

  const [relayList, setRelayList] = createSignal<RelayList>({ r: [], w: [], rw: [] }, { equals: false });
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  onMount(async () => {
    setIsLoading(true);
    setRelayList(await relay.fetchAndSetRelays());

    setIsLoading(false);
  });

  const displayError = (e: Event): void => {
    // @ts-ignore
    e.currentTarget.setCustomValidity("Enter a valid websocket URL");
  };

  const buildRelayEventTags = (): string[][] => {
    const relayListEventTags = [];
    for (const key in relayList()) {
      switch (key) {
        case "r":
          relayListEventTags.push(relayList().r.map((rl) => ["r", rl, "read"]));
          break;

        case "w":
          relayListEventTags.push(relayList().w.map((rl) => ["r", rl, "write"]));
          break;

        case "rw":
          relayListEventTags.push(relayList().rw.map((rl) => ["r", rl]));
          break;
      }
    }

    return relayListEventTags.flat();
  };

  const handleDeletion = async (relayType: "r" | "w" | "rw", relayAddress: string): Promise<void> => {
    switch (relayType) {
      case "r":
        relayList().r = relayList().r.filter((r) => r != relayAddress);
        break;

      case "w":
        relayList().w = relayList().w.filter((r) => r != relayAddress);
        break;

      case "rw":
        relayList().rw = relayList().rw.filter((r) => r != relayAddress);
        break;
    }

    await publishEvent();
  };

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault();

    // @ts-ignore
    const relayType = e.target[0].name;
    // @ts-ignore
    const relayAddress: string = e.target[0].value;
    if (relayAddress.trim() == "") {
      return;
    }

    switch (relayType) {
      case "r":
        relayList().r.push(relayAddress);
        break;

      case "w":
        relayList().w.push(relayAddress);
        break;

      case "rw":
        relayList().rw.push(relayAddress);
        break;
    }

    await publishEvent();
  };

  const publishEvent = async (): Promise<boolean> => {
    const relayListEvent: EventTemplate = {
      content: "",
      created_at: Math.floor(Date.now() / 1000),
      kind: Kind.RelayList,
      tags: buildRelayEventTags()
    };

    const signedEvent = await window.nostr.signEvent(relayListEvent);
    const pub: Pub = relay.pub(signedEvent);

    return await new Promise<boolean>((res) => {
      pub.on("ok", () => {
        setRelayList(relayList());
        relay.fetchAndSetRelays();
        readRelays.set(relay.getReadRelays());
        res(true);
      });

      pub.on("failed", () => {
        res(false);
      });
    });
  };

  type RelayBoxTitle = { r: string; w: string; rw: string };
  const relayBoxTitle = { r: "Read From", w: "Write To", rw: "Read & Write" };

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold mt-14'>
        Manage relays you connect to
      </h1>

      <div class='w-5/6 mx-auto mt-10 p-3 h-4/5'>
        <Show when={!isLoading()} fallback={<LoadingPoints />}>
          <div class='grid grid-cols-3 gap-x-3 h-full'>
            <For each={Object.entries(relayList())}>
              {(relays) => (
                <div class='flex flex-col justify-between col-span-1 bg-slate-700 bg-opacity-50 rounded pb-1 h-full'>
                  <h2 class='text-center uppercase tracking-tight py-3 text-slate-300 text-lg font-bold bg-slate-600 rounded mb-3'>
                    {relayBoxTitle[relays[0] as keyof RelayBoxTitle]}
                  </h2>

                  <div class='grow py-5 overflow-y-scroll custom-scrollbar h-[1vh]'>
                    <For each={relays[1]}>
                      {(relayAddress) => (
                        <div
                          class='flex items-center justify-between w-5/6 mx-auto my-1 py-2 px-2 bg-slate-600
                                   hover:bg-slate-400 hover:bg-opacity-25 rounded bg-opacity-25'
                        >
                          <div class='text-slate-300'>{relayAddress}</div>
                          <div
                            onClick={() => handleDeletion(relays[0] as "r" | "w" | "rw", relayAddress)}
                            class='text-red-400 text-opacity-40 hover:text-red-400 hover:text-opacity-100 
                                    cursor-pointer hover:scale-105 active:scale-95'
                          >
                            <RiSystemCloseCircleFill size={30} />
                          </div>
                        </div>
                      )}
                    </For>
                  </div>

                  <form onSubmit={handleSubmit} class='flex items-center justify-around py-2 px-1'>
                    <input
                      type='text'
                      name={relays[0]}
                      pattern='^ws.*'
                      oninvalid={displayError}
                      class='block w-4/5 py-2 rounded focus:outline-none bg-slate-500 bg-opacity-75
                             text-center caret-slate-200 text-slate-200'
                    />
                    <button
                      class='block h-full text-green-400 text-opacity-50 hover:text-opacity-100
                                    transition-all hover:scale-105 active:scale-95'
                    >
                      <TbPlus size={42} stroke-width={1.5} class='mx-auto' />
                    </button>
                  </form>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </>
  );
};

export default ManageRelays;
