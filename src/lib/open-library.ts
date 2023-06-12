import axios from "axios";

interface OpenLibraryResult {
  key: string;
  url: string;
  title: string;
  author_name: string[];
  author_key: string[];
  edition_count: number;
  has_fulltext: boolean;
  first_publish_year: number;
  cover_i: number;
  cover_url: string;
}

const searchBook = async (
  searchString: string
): Promise<OpenLibraryResult[]> => {
  const title = searchString.split(" ").reduce((acc, s) => `${acc}+${s}`);

  const resp = await axios({
    method: "GET",
    url: `https://openlibrary.org/search.json?title=${title}`,
  });

  return (resp.data.docs as OpenLibraryResult[]).map((res) => {
    res.url = `https://openlibrary.org${res.key}`;
    res.cover_url = `https://covers.openlibrary.org/b/id/${res.cover_i}-M.jpg`;
    return res;
  });
};

export { searchBook };
