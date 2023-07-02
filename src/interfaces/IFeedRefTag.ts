import { RefTagCategory } from "./IRefTag";

export interface IFeedRefTag {
  primaryInfo: string;
  secondaryInfo: string;
  preview: string;
  url: string;
  category: RefTagCategory;
}
