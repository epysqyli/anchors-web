import { EventTemplate, Kind, Pub, Relay } from "nostr-tools";

const deleteNostrEvent = async (relay: Relay, eventID: string): Promise<void> => {
  const deletionEvent: EventTemplate = {
    kind: Kind.EventDeletion,
    tags: [["e", eventID]],
    created_at: Math.floor(Date.now() / 1000),
    content: ""
  };

  const signedEvent = await window.nostr.signEvent(deletionEvent);
  const pubRes: Pub = relay.publish(signedEvent);

  pubRes.on("ok", () => {
    console.log("event deleted");
  });

  pubRes.on("failed", () => {
    console.log("failure");
  });
};

const reactToEvent = async (
  relay: Relay,
  eventID: string,
  eventPubkey: string,
  reaction: "+" | "-"
): Promise<void> => {
  const reactionEvent: EventTemplate = {
    kind: Kind.Reaction,
    tags: [
      ["e", eventID],
      ["p", eventPubkey]
    ],
    content: reaction,
    created_at: Math.floor(Date.now() / 1000)
  };

  const signedEvent = await window.nostr.signEvent(reactionEvent);
  const pubRes: Pub = relay.publish(signedEvent);

  pubRes.on("ok", () => {
    console.log("reaction sent");
  });

  pubRes.on("failed", () => {
    console.log("failure");
  });
};

export { deleteNostrEvent, reactToEvent };
