import { expect, test } from "vitest";
import { shrinkContent } from "~/lib/nostr/nostr-utils";

test("shrinkContent returns the same string for short content", () => {
  const expected = "This is some short content";

  const actual = shrinkContent(expected);

  expect(actual).toStrictEqual(expected);
});

test("shrinkContent returns short version with dots for long content", () => {
  const content =
    "You can also use variant modifiers to target media queries like responsive breakpoints, dark mode, presumably in many different ways";

  const expected =
    "You can also use variant modifiers to target media queries like responsive breakpoints, dark mode, p ...";

  const actual = shrinkContent(content);

  expect(actual).toStrictEqual(expected);
});
