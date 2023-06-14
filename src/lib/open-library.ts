import axios from "axios";

interface OpenLibraryResult {
  key: string;
  url: string;
  title: string;
  cover_i: number;
  cover_url: string;
  author_name: string[];
  first_publish_year: number;
}

const searchBook = async (searchString: string): Promise<OpenLibraryResult[]> => {
  const title = searchString.split(" ").reduce((acc, s) => `${acc}+${s}`);

  const resp = await axios({
    method: "GET",
    url: `https://openlibrary.org/search.json?title=${title}`
  });

  return (resp.data.docs as OpenLibraryResult[]).map((res) => {
    res.url = `https://openlibrary.org${res.key}`;
    res.cover_url = `https://covers.openlibrary.org/b/id/${res.cover_i}-S.jpg`;
    res.author_name = res.author_name == undefined ? [] : res.author_name;
    res.first_publish_year = res.first_publish_year == undefined ? 0 : res.first_publish_year;

    return res;
  });
};

export { searchBook };
