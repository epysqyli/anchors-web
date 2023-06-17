import { VsAdd, VsReferences } from "solid-icons/vs";
import { FiLink } from "solid-icons/fi";
import { RiMediaMovie2Line, RiSystemCloseCircleLine } from "solid-icons/ri";
import { RiLogosYoutubeLine } from "solid-icons/ri";
import { RiLogosSpotifyLine } from "solid-icons/ri";
import { RiDocumentBook2Line } from "solid-icons/ri";
import { Component, For, JSX, Show, createSignal } from "solid-js";
import { IRefTag } from "~/interfaces/IRefTag";
import { Motion } from "@motionone/solid";
import RefTagElement from "./RefTagElement";
import { BsSearch } from "solid-icons/bs";
import { searchBook } from "~/lib/open-library";
import RefTagResult from "./RefTagResult";
import { TbDatabaseSearch } from "solid-icons/tb";

interface RefType {
  icon: JSX.Element;
  selected: boolean;
  category: string;
}

interface Props {
  tags: IRefTag[];
  addNostrTag(nostrTag: IRefTag): void;
  removeNostrTag(nostrTag: IRefTag): void;
  toggleMenu(): void;
}

const RefTagsSearchPanel: Component<Props> = (props) => {
  const [refTypes, setRefTypes] = createSignal<RefType[]>([
    {
      icon: <RiDocumentBook2Line size={30} />,
      selected: false,
      category: "books"
    },
    {
      icon: <RiLogosYoutubeLine size={30} />,
      selected: false,
      category: "videos"
    },
    {
      icon: <RiMediaMovie2Line size={30} />,
      selected: false,
      category: "movies"
    },
    {
      icon: <RiLogosSpotifyLine size={30} />,
      selected: false,
      category: "songs"
    },
    {
      icon: <FiLink size={30} />,
      selected: true,
      category: "generic"
    }
  ]);

  const [showSearch, setShowSearch] = createSignal<boolean>(false);

  const [inputTerms, setInputTerms] = createSignal<string>("");
  const [searchResults, setSearchResults] = createSignal<IRefTag[]>([]);

  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  const search = async (e: Event) => {
    e.preventDefault();

    setSearchResults([]);
    setIsLoading(true);
    setSearchResults(await searchBook(inputTerms()));
    setIsLoading(false);
  };

  const selectRefType = (category: string) => {
    const currentRefTypes = refTypes().map((rt) => {
      const reftype: RefType = {
        icon: rt.icon,
        selected: rt.selected,
        category: rt.category
      };

      return reftype;
    });

    const updatedRefTypes: RefType[] = currentRefTypes.map((rt) => {
      rt.selected = rt.category == category ? true : false;
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

    const currentRefCategory = refTypes().find((rt) => rt.selected)?.category;

    if (currentRefCategory == "generic") {
      const refTag: IRefTag = {
        category: currentRefCategory,
        title: inputTerms(),
        url: inputTerms(),
        creator: "",
        preview: ""
      };

      props.addNostrTag(refTag);
      return;
    }

    setShowSearch(true);
    if (currentRefCategory == "books") {
      search(e);
    }
  };

  const handleOnChange = (e: Event) => {
    setInputTerms((e.currentTarget as HTMLInputElement).value);
  };

  const placeholder = (): string => {
    if (refTypes().find((rt) => rt.selected)?.category == "generic") {
      return "add an external resource URL";
    }

    return `search for ${refTypes().find((rt) => rt.selected)?.category}`;
  };

  const icon = (): JSX.Element => {
    if (refTypes().find((rt) => rt.selected)?.category == "generic") {
      return <VsAdd size={32} class='group-hover:scale-90 w-fit mx-auto' />;
    }

    return <BsSearch size={32} class='group-hover:scale-90 w-fit mx-auto' />;
  };

  const refCategoryIconStyle = (selected: boolean): string => {
    const basicStyle = `cursor-pointer group transition-scale
                        hover:bg-slate-400 hover:text-white
                        h-3/5 w-1/5 relative text-slate-200 rounded`;

    const selectedStyle = basicStyle + " bg-slate-300 text-slate-700";

    if (selected) {
      return selectedStyle;
    }

    return basicStyle;
  };

  const basicSelectorPanelStyle = `w-1/2 text-center border-b border-transparent 
                                   hover:border-b hover:border-slate-200 relative
                                   group cursor-pointer transition h-full rounded`;

  const activeSelectorPanelStyle = basicSelectorPanelStyle + " bg-slate-600";

  return (
    <>
      <div class='h-[80%]'>
        <div class='flex items-center justify-between gap-x-1 text-slate-200 h-[15%]'>
          <div
            onClick={() => setShowSearch(false)}
            class={showSearch() ? basicSelectorPanelStyle : activeSelectorPanelStyle}
          >
            <div
              class='group-active:scale-95 transition w-fit 
                        mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            >
              <VsReferences size={40} />
              <div class='absolute -top-3 -right-3'>{props.tags.length}</div>
            </div>
          </div>
          <div
            onClick={() => setShowSearch(true)}
            class={showSearch() ? activeSelectorPanelStyle : basicSelectorPanelStyle}
          >
            <div
              class='group-active:scale-95 transition w-fit 
                        mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            >
              <TbDatabaseSearch size={40} />
            </div>
          </div>
          <div onClick={props.toggleMenu} class={basicSelectorPanelStyle + " md:hidden"}>
            <div
              class='group-active:scale-95 transition w-fit 
                        mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            >
              <RiSystemCloseCircleLine size={40} />
            </div>
          </div>
        </div>

        <div class='py-5 overflow-y-auto custom-scrollbar h-[82%] my-3'>
          <Show when={!showSearch()}>
            <For each={props.tags}>
              {(tag) => (
                <Motion.div animate={{ scale: [0.5, 1] }} class='mb-3 w-11/12 mx-auto'>
                  <RefTagElement tag={tag} removeTag={props.removeNostrTag} />
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
                    <RefTagResult result={res} addTag={props.addNostrTag} />
                  </Motion.div>
                )}
              </For>
            </Show>
          </Show>
        </div>
      </div>

      <div class='h-[20%] border-t py-1'>
        <div class='flex items-center gap-x-1 justify-around h-3/5'>
          <For each={refTypes()}>
            {(refType) => {
              return (
                <div
                  onClick={() => selectRefType(refType.category)}
                  class={refCategoryIconStyle(refType.selected)}
                >
                  <div
                    class='w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                              group-active:scale-90'
                  >
                    {refType.icon}
                  </div>
                </div>
              );
            }}
          </For>
        </div>

        <form onSubmit={handleSubmit} class='flex items-center gap-x-1 h-2/5 mt-1'>
          <input
            placeholder={placeholder()}
            type='text'
            value={inputTerms()}
            onChange={handleOnChange}
            class='block focus:outline-none py-2 caret-slate-600
               placeholder:text-center placeholder:text text-slate-500 text-center
               focus:placeholder-none h-full w-4/5 rounded bg-slate-200'
          />
          <button
            class='block group text-slate-50 hover:bg-slate-600
                     active:bg-slate-800 p-3 h-full rounded w-1/5'
          >
            {icon()}
          </button>
        </form>
      </div>
    </>
  );
};

export default RefTagsSearchPanel;
