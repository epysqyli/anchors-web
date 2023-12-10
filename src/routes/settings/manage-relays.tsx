import { RelayContext } from "~/contexts/relay";
import { EventTemplate, Kind, Pub } from "nostr-tools";
import RelayForm from "~/components/settings/RelayForm";
import { isRelayReachable } from "~/lib/nostr/nostr-utils";
import { JSX, VoidComponent, createEffect, createSignal, useContext } from "solid-js";

const ManageRelays: VoidComponent = (): JSX.Element => {
  const { relay, readRelays, setupDone } = useContext(RelayContext);
  const [readingRelays, setReadingRelays] = createSignal<string[]>([], { equals: false });
  const [writingRelays, setWritingRelays] = createSignal<string[]>([], { equals: false });
  const [readingAndWritingRelays, setReadingAndWritingRelays] = createSignal<string[]>([], { equals: false });
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  createEffect(async () => {
    setIsLoading(true);
    setupDone();

    const relays = await relay.fetchAndSetRelays();
    setWritingRelays(relays.w);
    setReadingRelays(relays.r);
    setReadingAndWritingRelays(relays.rw);

    setIsLoading(false);
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
        readRelays.set(readingRelays());
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
          <RelayForm
            isLoading={isLoading}
            listType='r'
            relayList={readingRelays}
            handleDeletion={handleDeletion}
            handleSubmit={handleSubmit}
          />

          <RelayForm
            isLoading={isLoading}
            listType='w'
            relayList={writingRelays}
            handleDeletion={handleDeletion}
            handleSubmit={handleSubmit}
          />

          <RelayForm
            isLoading={isLoading}
            listType='rw'
            relayList={readingAndWritingRelays}
            handleDeletion={handleDeletion}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default ManageRelays;
