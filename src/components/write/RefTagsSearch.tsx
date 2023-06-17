import { BsSearch } from "solid-icons/bs";
import { searchBook } from "../../lib/open-library";
import { Component, For, createSignal } from "solid-js";
import RefTagResult from "./RefTagResult";
import { IRefTag } from "~/interfaces/IRefTag";

interface Props {
  category: string;
  addNostrTag(nostrTag: IRefTag): void;
}

const RefTagsSearch: Component<Props> = (props) => {
  const [searchTerms, setSearchTerms] = createSignal<string>("");
  const [searchResults, setSearchResults] = createSignal<IRefTag[]>([]);

  const updateSearchTerms = (e: Event) => {
    setSearchTerms((e.currentTarget as HTMLInputElement).value);
  };

  const search = async (e: Event) => {
    e.preventDefault();

    if (searchTerms().trim() == "") {
      console.log("visual hint: no search without terms");
      return;
    }

    setSearchResults(await searchBook(searchTerms()));
  };

  return (
    <form onSubmit={search} class='flex items-center h-1/2'>
      <input
        placeholder={`search for ${props.category}`}
        type='text'
        onChange={updateSearchTerms}
        class='block focus:outline-none py-2 caret-slate-600
        placeholder:text-center placeholder:text text-slate-500 text-center
        focus:placeholder-none h-full w-4/5'
      />

      <button
        class='block group text-slate-50 hover:bg-slate-600
                     active:bg-slate-800 p-3 h-full w-1/5'
      >
        <BsSearch size={32} class='group-hover:scale-90 w-fit mx-auto' />
      </button>
    </form>
  );
};

export default RefTagsSearch;

/* <div class='w-5/6 mx-auto my-5 h-3/4 custom-scrollbar overflow-y-auto'>
        <For each={searchResults()}>{(res) => <RefTagResult result={res} addTag={props.addNostrTag} />}</For>
      </div> */
