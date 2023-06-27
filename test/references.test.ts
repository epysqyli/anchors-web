import { expect, test } from "vitest";
import { parseReferenceType } from "~/lib/references";

test("parseReferenceType parses urls into correct RefTagCategory", () => {
  expect(parseReferenceType("https://github.com/solidjs/solid-testing-library")).toEqual("generic");

  expect(
    parseReferenceType(
      "https://www.youtube.com/watch?v=ZyQLlWzOvYw&list=FL6zRqV5BoLaPshnUjI_oLPg&index=1&t=22s"
    )
  ).toEqual("video");

  expect(parseReferenceType("https://openlibrary.org/works/OL62181W")).toEqual("book");

  expect(parseReferenceType("https://www.themoviedb.org/movie/311")).toEqual("movie");

  expect(parseReferenceType("https://open.spotify.com/track/71N78jUmfhLeRDlLd8elfl")).toEqual("song");
});
