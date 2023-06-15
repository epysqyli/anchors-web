import axios from "axios";
import IRefTagResult from "~/interfaces/IRefTagResult";

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

const searchBook = async (searchString: string): Promise<IRefTagResult[]> => {
  const title = searchString.split(" ").reduce((acc, s) => `${acc}+${s}`);

  const resp: OpenLibraryQueryResult = await axios({
    method: "GET",
    url: `https://openlibrary.org/search.json?title=${title}`
  });

  return resp.docs.map((res) => {
    const refTagResult: IRefTagResult = {
      title: res.title,
      url: `https://openlibrary.org${res.key}`,
      creator: res.author_name != undefined && res.author_name.length != 0 ? res.author_name[0] : "",
      preview: `https://covers.openlibrary.org/b/id/${res.cover_i}-S.jpg`
    };

    return refTagResult;
  });
};

export { searchBook };
