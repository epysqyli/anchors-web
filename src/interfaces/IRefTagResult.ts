import { RefTagCategory } from "./IRefTag";

export default interface IRefTagResult {
  preview: string;
  title: string;
  creator: string;
  url: string;
  category: RefTagCategory;
}
