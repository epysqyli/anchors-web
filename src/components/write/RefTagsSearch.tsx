import { BsSearch } from "solid-icons/bs";
import { searchBook } from "../../lib/open-library";
import { Component, For, createSignal } from "solid-js";
import IRefTagResult from "~/interfaces/IRefTagResult";
import RefTagResult from "./RefTagResult";
import { IRefTag } from "~/interfaces/IRefTag";

interface Props {
  category: string;
  addNostrTag(nostrTag: IRefTag): void;
}

const RefTagsSearch: Component<Props> = (props) => {
  const [searchTerms, setSearchTerms] = createSignal<string>("");
  const [searchResults, setSearchResults] = createSignal<IRefTagResult[]>([]);

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
            <BsSearch size={22} class='hover:scale-105 active:scale-95 cursor-pointer' />
          </button>
        </form>
      </div>

      <div class='w-5/6 mx-auto my-5 h-3/4 custom-scrollbar overflow-y-auto'>
        <For each={searchResults()}>{(res) => <RefTagResult result={res} addTag={props.addNostrTag} />}</For>
      </div>
    </div>
  );
};

export default RefTagsSearch;
