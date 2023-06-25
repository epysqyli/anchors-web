type RefTagCategory = "book" | "video" | "movie" | "song" | "generic";
interface IRefTag {
  preview: string;
  title: string;
  creator: string;
  url: string;
  category: RefTagCategory;
  additionalInfoOne: string;
}

export { RefTagCategory, IRefTag };
