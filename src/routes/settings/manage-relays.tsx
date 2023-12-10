import { TbPlus } from "solid-icons/tb";
import { RelayContext } from "~/contexts/relay";
import { EventTemplate, Kind, Pub } from "nostr-tools";
import { RiSystemCloseCircleFill } from "solid-icons/ri";
import { isRelayReachable } from "~/lib/nostr/nostr-utils";
import { For, JSX, VoidComponent, createEffect, createSignal, useContext } from "solid-js";

const ManageRelays: VoidComponent = (): JSX.Element => {
  const { relay, readRelays, authMode, setupDone } = useContext(RelayContext);
  const [readingRelays, setReadingRelays] = createSignal<string[]>([], { equals: false });
  const [writingRelays, setWritingRelays] = createSignal<string[]>([], { equals: false });
  const [readingAndWritingRelays, setReadingAndWritingRelays] = createSignal<string[]>([], { equals: false });

  createEffect(async () => {
    setupDone();

    const relays = await relay.fetchAndSetRelays();
    setWritingRelays(relays.w);
    setReadingRelays(relays.r);
    setReadingAndWritingRelays(relays.rw);
  });

  const displayError = (e: Event): void => {
    // @ts-ignore
    e.currentTarget.setCustomValidity("Enter a valid and secure websocket URL that starts with wss://");
  };

  const buildRelayEventTags = (): string[][] => {
    const relayListEventTags = [];

    relayListEventTags.push(readingRelays().map((r) => ["r", r, "read"]));
    relayListEventTags.push(writingRelays().map((r) => ["r", r, "write"]));
    relayListEventTags.push(readingAndWritingRelays().map((r) => ["r", r]));

    return relayListEventTags.flat();
  };

  const handleDeletion = async (relayType: "r" | "w" | "rw", relayAddress: string): Promise<void> => {
    switch (relayType) {
      case "r":
        setReadingRelays(readingRelays().filter((r) => r != relayAddress));
        break;

      case "w":
        setWritingRelays(writingRelays().filter((r) => r != relayAddress));
        break;

      case "rw":
        setReadingAndWritingRelays(readingAndWritingRelays().filter((r) => r != relayAddress));
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
    // @ts-ignore
    e.target[0].value = "";

    if (relayAddress.trim() == "") {
      return;
    }

    if (!(await isRelayReachable(relayAddress))) {
      return;
    }

    switch (relayType) {
      case "r":
        setReadingRelays([...readingRelays(), relayAddress]);
        break;

      case "w":
        setWritingRelays([...writingRelays(), relayAddress]);
        break;

      case "rw":
        setReadingAndWritingRelays([...readingAndWritingRelays(), relayAddress]);
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

    await relay.deleteAllRelayListEvents();
    const signedEvent = await window.nostr.signEvent(relayListEvent);
    const pub: Pub = relay.pub(signedEvent, relay.getAllRelays());

    return await new Promise<boolean>((res) => {
      pub.on("ok", async () => {
        const relays = await relay.fetchAndSetRelays();
        setWritingRelays(relays.w);
        setReadingRelays(relays.r);
        setReadingAndWritingRelays(relays.rw);
        readRelays.set(relay.getReadRelays());
        res(true);
      });

      pub.on("failed", () => {
        res(false);
      });
    });
  };

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold py-5 xl:py-10'>
        Manage relays you connect to
      </h1>

      <div class='mx-auto xl:w-5/6 xl:p-3 h-4/5'>
        <div class='xl:grid xl:grid-cols-3 gap-x-3 h-full overflow-y-scroll px-5 xl:px-0 xl:custom-scrollbar relative snap-mandatory snap-y xl:snap-none'>
          <div class='flex flex-col justify-between col-span-1 bg-slate-700 bg-opacity-50 rounded pb-1 h-full mb-3 xl:mb-0 snap-start'>
            <h2 class='text-center uppercase tracking-tight py-3 text-slate-300 text-lg font-bold bg-slate-600 rounded mb-3'>
              Read From
            </h2>

            <div class='grow py-5 overflow-y-scroll xl:custom-scrollbar h-[1vh]'>
              <For each={readingRelays()}>
                {(relayAddress) => (
                  <div class='flex items-center justify-between w-5/6 mx-auto my-1 py-2 px-2 bg-slate-600 hover:bg-slate-400 hover:bg-opacity-25 rounded bg-opacity-25'>
                    <div class='text-slate-300'>{relayAddress}</div>
                    {authMode.get() == "private" ? (
                      <div
                        onClick={() => handleDeletion("r", relayAddress)}
                        class='text-red-400 text-opacity-40 hover:text-red-400 hover:text-opacity-100 cursor-pointer hover:scale-105 active:scale-95'
                      >
                        <RiSystemCloseCircleFill size={30} />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                )}
              </For>
            </div>

            {authMode.get() == "private" ? (
              <form onSubmit={handleSubmit} class='flex items-center justify-around py-2 px-1'>
                <input
                  id='reading'
                  type='text'
                  name='r'
                  pattern='^wss.*'
                  oninvalid={displayError}
                  class='block w-4/5 py-2 rounded focus:outline-none bg-slate-500 bg-opacity-75 text-center caret-slate-200 text-slate-200'
                />
                <button class='block h-full text-green-400 text-opacity-50 hover:text-opacity-100 transition-all hover:scale-105 active:scale-95'>
                  <TbPlus size={42} stroke-width={1.5} class='mx-auto' />
                </button>
              </form>
            ) : (
              <></>
            )}
          </div>

          <div class='flex flex-col justify-between col-span-1 bg-slate-700 bg-opacity-50 rounded pb-1 h-full mb-3 xl:mb-0 snap-start'>
            <h2 class='text-center uppercase tracking-tight py-3 text-slate-300 text-lg font-bold bg-slate-600 rounded mb-3'>
              Write To
            </h2>

            <div class='grow py-5 overflow-y-scroll xl:custom-scrollbar h-[1vh]'>
              <For each={writingRelays()}>
                {(relayAddress) => (
                  <div class='flex items-center justify-between w-5/6 mx-auto my-1 py-2 px-2 bg-slate-600 hover:bg-slate-400 hover:bg-opacity-25 rounded bg-opacity-25'>
                    <div class='text-slate-300'>{relayAddress}</div>
                    {authMode.get() == "private" ? (
                      <div
                        onClick={() => handleDeletion("w", relayAddress)}
                        class='text-red-400 text-opacity-40 hover:text-red-400 hover:text-opacity-100 cursor-pointer hover:scale-105 active:scale-95'
                      >
                        <RiSystemCloseCircleFill size={30} />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                )}
              </For>
            </div>

            {authMode.get() == "private" ? (
              <form onSubmit={handleSubmit} class='flex items-center justify-around py-2 px-1'>
                <input
                  id='reading'
                  type='text'
                  name='w'
                  pattern='^wss.*'
                  oninvalid={displayError}
                  class='block w-4/5 py-2 rounded focus:outline-none bg-slate-500 bg-opacity-75 text-center caret-slate-200 text-slate-200'
                />
                <button class='block h-full text-green-400 text-opacity-50 hover:text-opacity-100 transition-all hover:scale-105 active:scale-95'>
                  <TbPlus size={42} stroke-width={1.5} class='mx-auto' />
                </button>
              </form>
            ) : (
              <></>
            )}
          </div>

          <div class='flex flex-col justify-between col-span-1 bg-slate-700 bg-opacity-50 rounded pb-1 h-full mb-3 xl:mb-0 snap-start'>
            <h2 class='text-center uppercase tracking-tight py-3 text-slate-300 text-lg font-bold bg-slate-600 rounded mb-3'>
              Read & Write
            </h2>

            <div class='grow py-5 overflow-y-scroll xl:custom-scrollbar h-[1vh]'>
              <For each={readingAndWritingRelays()}>
                {(relayAddress) => (
                  <div class='flex items-center justify-between w-5/6 mx-auto my-1 py-2 px-2 bg-slate-600 hover:bg-slate-400 hover:bg-opacity-25 rounded bg-opacity-25'>
                    <div class='text-slate-300'>{relayAddress}</div>
                    {authMode.get() == "private" ? (
                      <div
                        onClick={() => handleDeletion("rw", relayAddress)}
                        class='text-red-400 text-opacity-40 hover:text-red-400 hover:text-opacity-100 cursor-pointer hover:scale-105 active:scale-95'
                      >
                        <RiSystemCloseCircleFill size={30} />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                )}
              </For>
            </div>

            {authMode.get() == "private" ? (
              <form onSubmit={handleSubmit} class='flex items-center justify-around py-2 px-1'>
                <input
                  id='reading'
                  type='text'
                  name='rw'
                  pattern='^wss.*'
                  oninvalid={displayError}
                  class='block w-4/5 py-2 rounded focus:outline-none bg-slate-500 bg-opacity-75 text-center caret-slate-200 text-slate-200'
                />
                <button class='block h-full text-green-400 text-opacity-50 hover:text-opacity-100 transition-all hover:scale-105 active:scale-95'>
                  <TbPlus size={42} stroke-width={1.5} class='mx-auto' />
                </button>
              </form>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageRelays;
