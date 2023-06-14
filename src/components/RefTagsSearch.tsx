import { searchBook } from "../lib/open-library";
import { BiRegularSearchAlt2 } from "solid-icons/bi";
import { Component, For, createSignal } from "solid-js";

interface Props {
  category: string;
}

interface SearchResult {
  refIdentifier: string;
  imageUrl: string;
  info: { main: string; secondary: string; optional: string };
}

const RefTagsSearch: Component<Props> = (props) => {
  const [searchTerms, setSearchTerms] = createSignal<string>("");
  const [searchResults, setSearchResults] = createSignal<SearchResult[]>([]);

  const updateSearchTerms = (e: Event) => {
    setSearchTerms((e.currentTarget as HTMLInputElement).value);
  };

  const search = async (e: Event) => {
    e.preventDefault();

    if (searchTerms().trim() == "") {
      console.log("visual hint: no search without terms");
      return;
    }

    // manage all empty result fields
    // setup a proper function to structure data in this generic way
    // setup a more general design that returns, for all resource types, a result T[]
    const results: SearchResult[] = (await searchBook(searchTerms())).map((r) => {
      return {
        refIdentifier: r.url,
        imageUrl: r.cover_url,
        info: {
          main: r.title,
          secondary: r.author_name.length != 0 ? r.author_name[0] : "",
          optional: r.first_publish_year.toString()
        }
      };
    });

    setSearchResults(results);
  };

  return (
    <div class='mt-10 h-[90%]'>
      <div>
        <form onSubmit={search} class='flex items-center justify-center gap-x-5'>
          <input
            placeholder={`search for ${props.category}`}
            type='text'
            onChange={updateSearchTerms}
            class='block focus:outline-none rounded py-2 caret-slate-600
            placeholder:text-center placeholder:text-sm text-slate-500 text-center
            focus:placeholder-none'
          />
          <button>
            <BiRegularSearchAlt2 size={30} class='hover:scale-105 active:scale-95 cursor-pointer' />
          </button>
        </form>
      </div>

      <div class='w-5/6 mx-auto my-5 h-3/4 custom-scrollbar overflow-y-auto'>
        <For each={searchResults()}>
          {(res) => {
            return (
              <div class='flex items-center justify-between my-2 p-1'>
                <img src={res.imageUrl} loading='lazy' class='rounded border' />
                <div>{res.info.main}</div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
};

export default RefTagsSearch;
