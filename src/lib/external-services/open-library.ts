import axios, { AxiosResponse } from "axios";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";
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

interface OpenLIbraryFetchResult {
  title: string;
  covers: string[];
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
      additionalInfoTwo: ""
    };

    return refTagResult;
  });
};

const fetchBook = async (bookID: string, url: string): Promise<IFeedRefTag> => {
  const resp: AxiosResponse<OpenLIbraryFetchResult> = await axios({
    method: "GET",
    url: `https://openlibrary.org/works/${bookID}.json`
  });

  return {
    preview:
      resp.data.covers != undefined && resp.data.covers.length != 0
        ? `https://covers.openlibrary.org/b/id/${resp.data.covers[0]}-M.jpg`
        : "",
    primaryInfo: resp.data.title,
    secondaryInfo: "",
    url: url,
    category: "book"
  };
};

export { searchBook, fetchBook };
