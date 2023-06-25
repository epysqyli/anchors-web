import axios, { AxiosResponse } from "axios";
import { IRefTag } from "~/interfaces/IRefTag";

interface OpenLibraryQueryResult {
  docs: {
    key: string;
    url: string;
    title: string;
    cover_i: number;
    cover_url: string;
    author_name: string[];
    first_publish_year: number;
  }[];
}

const searchBook = async (searchString: string): Promise<IRefTag[]> => {
  const title = searchString.split(" ").reduce((acc, s) => `${acc}+${s}`);

  const resp: AxiosResponse<OpenLibraryQueryResult> = await axios({
    method: "GET",
    url: `https://openlibrary.org/search.json?title=${title}`
  });

  return resp.data.docs.map((res) => {
    const refTagResult: IRefTag = {
      title: res.title,
      url: `https://openlibrary.org${res.key}`,
      preview: res.cover_i != undefined ? `https://covers.openlibrary.org/b/id/${res.cover_i}-M.jpg` : "",
      category: "book",
      additionalInfoOne: res.author_name?.map((authorName) => authorName).join(", "),
      additionalInfoTwo: "",
    };

    return refTagResult;
  });
};

export { searchBook };
