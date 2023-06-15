type RefTagCategory = "book" | "video" | "movie" | "song" | "generic";

interface IRefTag {
  value: string;
  category: RefTagCategory;
}

export { IRefTag, RefTagCategory };
