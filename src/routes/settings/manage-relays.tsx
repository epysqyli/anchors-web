import RelayList from "~/interfaces/RelayList";
import { RelayContext } from "~/contexts/relay";
import { RiSystemCloseCircleFill } from "solid-icons/ri";
import LoadingFallback from "~/components/feed/LoadingFallback";
import { EventTemplate, Kind, Pub } from "nostr-tools";
import { For, JSX, Show, VoidComponent, createSignal, onMount, useContext } from "solid-js";
import { TbCirclePlus } from "solid-icons/tb";

const ManageRelays: VoidComponent = (): JSX.Element => {
  const { relay } = useContext(RelayContext);

  const [relayList, setRelayList] = createSignal<RelayList>({ r: [], w: [], rw: [] }, { equals: false });
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  onMount(async () => {
    setIsLoading(true);
    setRelayList(await relay.fetchAndSetRelays());
    // console.log(relayList());

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
  }

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

    const relayListEvent: EventTemplate = {
      content: "",
      created_at: Math.floor(Date.now() / 1000),
      kind: Kind.RelayList,
      tags: buildRelayEventTags()
    };

    const signedEvent = await window.nostr.signEvent(relayListEvent);
    const pub: Pub = relay.pub(signedEvent);

    const isPubResOk = await new Promise<boolean>((res) => {
      pub.on("ok", () => {
        setRelayList(relayList());
        res(true);
      });

      pub.on("failed", () => {
        res(false);
      });
    });
  };

  type RelayBoxTitle = { r: string; w: string; rw: string };
  const relayBoxTitle = { r: "read-only", w: "write-only", rw: "read/write" };

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold mt-14'>
        Manage relays you connect to
      </h1>

      <div class='w-5/6 mx-auto mt-10 p-3 h-4/5'>
        <Show when={!isLoading()} fallback={<LoadingFallback />}>
          <div class='grid grid-cols-3 gap-x-3 h-full'>
            <For each={Object.entries(relayList())}>
              {(relays) => (
                <div class='flex flex-col justify-between col-span-1 bg-slate-700 rounded pb-1 h-full'>
                  <h2 class='text-center tracking-tight py-3 text-slate-300 text-xl bg-slate-500 bg-opacity-30 rounded-t-md'>
                    {relayBoxTitle[relays[0] as keyof RelayBoxTitle]}
                  </h2>

                  <div class='grow py-5 overflow-y-scroll custom-scrollbar h-[1vh]'>
                    <For each={relays[1]}>
                      {(relayAddress) => (
                        <div class='flex items-center justify-between w-4/5 mx-auto my-2'>
                          <div class='text-slate-300'>{relayAddress}</div>
                          <div class='text-slate-400 hover:text-red-300 text-opacity-75'>
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
                    <button class='block h-full text-slate-300 hover:scale-105 active:scale-95'>
                      <TbCirclePlus size={42} stroke-width={1} class='mx-auto' />
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
