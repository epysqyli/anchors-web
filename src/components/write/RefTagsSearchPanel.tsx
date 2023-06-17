import { VsAdd } from "solid-icons/vs";
import { FiLink } from "solid-icons/fi";
import RefTagsSearch from "./RefTagsSearch";
import { RiMediaMovie2Line } from "solid-icons/ri";
import { RiLogosYoutubeLine } from "solid-icons/ri";
import { RiLogosSpotifyLine } from "solid-icons/ri";
import { RiDocumentBook2Line } from "solid-icons/ri";
import { Component, For, JSX, Show, createSignal } from "solid-js";
import { IRefTag } from "~/interfaces/IRefTag";
import { Motion } from "@motionone/solid";
import RefTagElement from "./RefTagElement";

interface RefType {
  icon: JSX.Element;
  selected: boolean;
  category: string;
}

interface Props {
  tags: IRefTag[];
  addNostrTag(nostrTag: IRefTag): void;
  removeNostrTag(nostrTag: IRefTag): void;
}

const RefTagsSearchPanel: Component<Props> = (props) => {
  const [refTypes, setRefTypes] = createSignal<RefType[]>([
    {
      icon: <RiDocumentBook2Line size={26} />,
      selected: false,
      category: "books"
    },
    {
      icon: <RiLogosYoutubeLine size={26} />,
      selected: false,
      category: "videos"
    },
    {
      icon: <RiMediaMovie2Line size={26} />,
      selected: false,
      category: "movies"
    },
    {
      icon: <RiLogosSpotifyLine size={26} />,
      selected: false,
      category: "songs"
    },
    {
      icon: <FiLink size={26} />,
      selected: true,
      category: "generic"
    }
  ]);

  const [refTag, setRefTag] = createSignal<IRefTag>({
    category: "generic",
    title: "",
    url: "",
    creator: "",
    preview: ""
  });

  const basicStyle = `cursor-pointer group transition-scale hover:bg-slate-400 hover:text-slate-700
      h-full w-1/5 relative text-slate-200`;
  const selectedStyle = basicStyle + " bg-slate-50 text-slate-700";

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

  const updateRefValue = (e: Event) => {
    const inputValue = (e.currentTarget as HTMLInputElement).value;
    const updatedRefTag: IRefTag = {
      category: refTag().category,
      title: inputValue,
      url: inputValue,
      preview: "",
      creator: ""
    };
    setRefTag(updatedRefTag);
  };

  const addTag = (e: Event) => {
    e.preventDefault();

    if (refTag().url.trim() == "") {
      console.log("show a visual error here");
      return;
    }

    props.addNostrTag(refTag());
    const defaultRefTag: IRefTag = {
      category: refTag().category,
      title: "",
      url: "",
      creator: "",
      preview: ""
    };
    setRefTag(defaultRefTag);
  };

  return (
    <>
      <div class='py-2 overflow-y-auto custom-scrollbar h-[80%]'>
        <For each={props.tags}>
          {(tag) => (
            <Motion.div animate={{ scale: [0.5, 1] }} class='mb-3 w-11/12 mx-auto'>
              <RefTagElement tag={tag} removeTag={props.removeNostrTag} />
            </Motion.div>
          )}
        </For>
      </div>

      <div class='h-[20%] border-t'>
        <div class='flex items-center justify-around h-1/2'>
          <For each={refTypes()}>
            {(refType) => {
              return (
                <div
                  onClick={() => selectRefType(refType.category)}
                  class={refType.selected ? selectedStyle : basicStyle}
                >
                  <div class='w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                    {refType.icon}
                  </div>
                </div>
              );
            }}
          </For>
        </div>

        <Show when={refTypes().find((rt) => rt.selected)?.category == "generic"}>
          <form onSubmit={addTag} class='flex items-center h-1/2'>
            <input
              placeholder="add an external resource's URL"
              type='text'
              value={refTag().url}
              onChange={updateRefValue}
              class='block focus:outline-none py-2 caret-slate-600
               placeholder:text-center placeholder:text text-slate-500 text-center
               focus:placeholder-none h-full w-4/5'
            />
            <button
              class='block group text-slate-50 hover:bg-slate-600
                     active:bg-slate-800 p-3 h-full w-1/5'
            >
              <VsAdd size={32} class='group-hover:scale-90 w-fit mx-auto' />
            </button>
          </form>
        </Show>

        <Show when={refTypes().find((rt) => rt.selected)?.category != "generic"}>
          <RefTagsSearch
            category={refTypes().find((rt) => rt.selected)!.category}
            addNostrTag={props.addNostrTag}
          />
        </Show>
      </div>
    </>
  );
};

export default RefTagsSearchPanel;
