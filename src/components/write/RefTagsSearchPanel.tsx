import { FiLink } from "solid-icons/fi";
import { Motion } from "@motionone/solid";
import { BsSearch } from "solid-icons/bs";
import RefTagResult from "./RefTagResult";
import RefTagElement from "./RefTagElement";
import { TbDatabaseSearch } from "solid-icons/tb";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import { VsAdd, VsReferences } from "solid-icons/vs";
import { searchMovies } from "~/lib/external-services/tmdb";
import { searchSongs } from "~/lib/external-services/spotify";
import { IRefTag, RefTagCategory } from "~/interfaces/IRefTag";
import { searchBook } from "~/lib/external-services/open-library";
import { Component, For, JSX, Show, createSignal } from "solid-js";
import {
  RiMediaMovie2Line,
  RiSystemCloseCircleLine,
  RiDocumentBook2Line,
  RiLogosSpotifyLine,
  RiLogosYoutubeLine
} from "solid-icons/ri";

interface RefType {
  icon: JSX.Element;
  selected: boolean;
  category: RefTagCategory;
  placeholder: string;
  searchButton: JSX.Element;
}

interface Props {
  tags: IRefTag[];
  addReferenceTag(nostrTag: IRefTag): void;
  removeReferenceTag(nostrTag: IRefTag): void;
  toggleMenu(): void;
}

const RefTagsSearchPanel: Component<Props> = (props) => {
  const [refTypes, setRefTypes] = createSignal<RefType[]>([
    {
      icon: <RiDocumentBook2Line size={30} />,
      selected: false,
      category: "book",
      placeholder: "search for books on openlibrary",
      searchButton: <BsSearch size={32} class='group-hover:scale-90 w-fit mx-auto' />
    },
    {
      icon: <RiLogosYoutubeLine size={30} />,
      selected: false,
      category: "video",
      placeholder: "add a video url to this post",
      searchButton: <VsAdd size={32} class='group-hover:scale-90 w-fit mx-auto' />
    },
    {
      icon: <RiMediaMovie2Line size={30} />,
      selected: false,
      category: "movie",
      placeholder: "search for a movie on TMDB",
      searchButton: <BsSearch size={32} class='group-hover:scale-90 w-fit mx-auto' />
    },
    {
      icon: <RiLogosSpotifyLine size={30} />,
      selected: false,
      category: "song",
      placeholder: "search for a song on spotify",
      searchButton: <BsSearch size={32} class='group-hover:scale-90 w-fit mx-auto' />
    },
    {
      icon: <FiLink size={30} />,
      selected: true,
      category: "generic",
      placeholder: "add a generic url to this post",
      searchButton: <VsAdd size={32} class='group-hover:scale-90 w-fit mx-auto' />
    }
  ]);

  const [currentRefType, setCurrentRefType] = createSignal<RefType>(refTypes()[4]);

  const [showSearch, setShowSearch] = createSignal<boolean>(false);

  const [inputTerms, setInputTerms] = createSignal<string>("");
  const [searchResults, setSearchResults] = createSignal<IRefTag[]>([]);

  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  const search = async (e: Event) => {
    e.preventDefault();

    setSearchResults([]);
    setIsLoading(true);

    switch (currentRefType().category) {
      case "book":
        setSearchResults(await searchBook(inputTerms()));
        break;
      case "song":
        setSearchResults(await searchSongs(inputTerms()));
        break;
      case "movie":
        setSearchResults(await searchMovies(inputTerms()));
        break;
      default:
        break;
    }

    setIsLoading(false);
  };

  const selectRefType = (category: string) => {
    const currentRefTypes = refTypes().map((rt) => {
      const reftype: RefType = {
        icon: rt.icon,
        selected: rt.selected,
        category: rt.category,
        placeholder: rt.placeholder,
        searchButton: rt.searchButton
      };

      return reftype;
    });

    const updatedRefTypes: RefType[] = currentRefTypes.map((rt) => {
      rt.selected = rt.category == category ? true : false;

      if (rt.selected) {
        setCurrentRefType(rt);
      }

      return rt;
    });

    setRefTypes(updatedRefTypes);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (inputTerms().trim() == "") {
      console.log("visual hint: input is empty");
      return;
    }

    if (currentRefType().category == "generic" || currentRefType().category == "video") {
      const refTag: IRefTag = {
        category: currentRefType().category,
        title: inputTerms(),
        url: inputTerms(),
        preview: "",
        additionalInfoOne: "",
        additionalInfoTwo: ""
      };

      props.addReferenceTag(refTag);
      return;
    }

    setShowSearch(true);
    search(e);
  };

  const handleOnChange = (e: Event) => {
    setInputTerms((e.currentTarget as HTMLInputElement).value);
  };

  const refCategoryIconStyle = (selected: boolean): string => {
    const basicStyle = `cursor-pointer group transition-scale
                        h-3/5 w-1/5 relative border-y border-transparent
                        hover:border-slate-400 text-slate-300`;

    const selectedStyle = basicStyle + " bg-slate-600 border-orange-200 ";

    if (selected) {
      return selectedStyle;
    }

    return basicStyle;
  };

  const panelSelectorStyle = (active: boolean): string => {
    if (active) {
      return "w-1/2 relative h-full text-center group cursor-pointer transition rounded bg-slate-600";
    }

    return "w-1/2 relative h-full text-center group cursor-pointer transition rounded hover:bg-slate-700";
  };

  return (
    <>
      <div class='h-[80%] max-h-[80%]'>
        <div class='flex items-center justify-between gap-x-1 md:px-5 md:gap-x-10 text-slate-200 h-[15%]'>
          <div onClick={() => setShowSearch(false)} class={panelSelectorStyle(!showSearch())}>
            <div class='group-active:scale-95 transition w-fit mx-auto
                        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              <VsReferences size={useIsNarrow() ? 30 : 40} />
              <div class='absolute -top-5 -right-10'>{props.tags.length}</div>
            </div>
          </div>

          <div onClick={() => setShowSearch(true)} class={panelSelectorStyle(showSearch())}>
            <div class='group-active:scale-95 transition w-fit mx-auto
                        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              <TbDatabaseSearch size={useIsNarrow() ? 30 : 40} />
            </div>
          </div>

          <div
            onClick={props.toggleMenu}
            class='w-1/2 relative h-full text-center group cursor-pointer transition rounded md:hidden'
          >
            <div class='group-active:scale-95 transition w-fit mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              <RiSystemCloseCircleLine size={useIsNarrow() ? 30 : 40} />
            </div>
          </div>
        </div>

        <div class='py-5 overflow-auto custom-scrollbar h-[82%] my-3 mr-2'>
          <Show when={!showSearch()}>
            <For each={props.tags}>
              {(tag) => (
                <Motion.div animate={{ scale: [0.5, 1] }} class='mb-3 w-11/12 mx-auto'>
                  <RefTagElement tag={tag} removeReferenceTag={props.removeReferenceTag} />
                </Motion.div>
              )}
            </For>
          </Show>

          <Show when={showSearch()}>
            <Show when={isLoading()}>
              <div class='animate-pulse w-5/6 mx-auto bg-slate-500 bg-opacity-30 h-1/5 rounded mb-5'></div>
              <div class='animate-pulse w-5/6 mx-auto bg-slate-500 bg-opacity-30 h-1/5 rounded mb-5'></div>
              <div class='animate-pulse w-5/6 mx-auto bg-slate-500 bg-opacity-30 h-1/5 rounded mb-5'></div>
              <div class='animate-pulse w-5/6 mx-auto bg-slate-500 bg-opacity-30 h-1/5 rounded mb-5'></div>
            </Show>

            <Show when={!isLoading()}>
              <For each={searchResults()}>
                {(res) => (
                  <Motion.div animate={{ scale: [0.5, 1] }} class='mb-3 w-11/12 mx-auto'>
                    <RefTagResult result={res} addTag={props.addReferenceTag} />
                  </Motion.div>
                )}
              </For>
            </Show>
          </Show>
        </div>
      </div>

      <div class='h-[20%] w-11/12 mx-auto md:w-full py-1 px-2'>
        <div class='flex items-center gap-x-3 px-5 justify-around h-3/5'>
          <For each={refTypes()}>
            {(refType) => {
              return (
                <div
                  onClick={() => selectRefType(refType.category)}
                  class={refCategoryIconStyle(refType.selected)}
                >
                  <div class='w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-active:scale-90'>
                    {refType.icon}
                  </div>
                </div>
              );
            }}
          </For>
        </div>

        <form
          onSubmit={handleSubmit}
          class='flex items-center justify-center gap-x-1
                                             h-2/5 mt-1 mx-auto md:px-5 md:gap-x-5'
        >
          <input
            placeholder={currentRefType().placeholder}
            type='text'
            value={inputTerms()}
            onChange={handleOnChange}
            class='block focus:outline-none py-2 caret-slate-200
               placeholder:text-center placeholder:text text-slate-200 text-center
               placeholder:text-sm md:placeholder:text-[13pt] md:text-[13pt]
               focus:placeholder-none h-full w-4/5 bg-slate-600
               border-y border-transparent focus:border-orange-200'
          />
          <button class='block group text-slate-50 hover:bg-slate-600 active:bg-slate-800 p-3 h-full rounded w-1/5'>
            {currentRefType().searchButton}
          </button>
        </form>
      </div>
    </>
  );
};

export default RefTagsSearchPanel;
