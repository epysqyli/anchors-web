import { describe } from "vitest";
import { Event, Kind } from "nostr-tools";
import { render } from "@solidjs/testing-library";
import UserNostrEvent from "~/components/my-posts/UserNostrEvent";
import { shrinkContent } from "~/lib/nostr/nostr-utils";

describe("<UserNostrEvent />", () => {
  const nostrEvent: Event = {
    tags: [],
    kind: Kind.Text,
    created_at: 1689538558,
    content: "Just some new event",
    id: "dfedf5b2704f8299abf6b58ddd79ee69b12741b39a08187de993374930e5db7c",
    pubkey: "8becb32986f141b2399559e34fd31a720376f4bbbeb735ed8a3288d544cf946f",
    sig: "635621192591f3a8d15aa0277072e827db2617b4e0c60bafc58b82d32e5c7e2b9a8f07ddc0d7b2958664838cd091adcf3b7296b7040660a702355057253500c9"
  };

  it("shows the event attributes", () => {
    const { unmount, getByText } = render(() => <UserNostrEvent nostrEvent={nostrEvent} />);
    
    const eventID = getByText(nostrEvent.id);
    const content = getByText(shrinkContent(nostrEvent.content));

    const date = getByText("22:15:58 Sun Jul 16 2023");
    
    expect(eventID).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(date).toBeInTheDocument();

    unmount();
  });
});
