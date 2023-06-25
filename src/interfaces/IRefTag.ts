type RefTagCategory = "book" | "video" | "movie" | "song" | "generic";
interface IRefTag {
  preview: string;
  title: string;
  url: string;
  category: RefTagCategory;
  additionalInfoOne: string;
  additionalInfoTwo: string;
}

export { RefTagCategory, IRefTag };
