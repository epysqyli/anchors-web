import type { RefTagCategory } from "~/interfaces/IRefTag";

// parse reference url to category type
const parseReferenceType = (url: string): RefTagCategory => {
  if (url.includes("youtube") || url.includes("youtu.be")) {
    return "video"
  };

  if (url.includes("spotify")) {
    return "song"
  };

  if (url.includes("themoviedb")) {
    return "movie"
  };

  if (url.includes("openlibrary")) {
    return "book"
  };

  return "generic";
};

export { parseReferenceType };
