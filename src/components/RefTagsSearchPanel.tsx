import { VsAdd } from "solid-icons/vs";
import IRefTag from "~/interfaces/IRefTag";
import { RiLogosSpotifyLine } from "solid-icons/ri";
import { RiDocumentBook2Line } from "solid-icons/ri";
import { BiRegularCameraMovie } from "solid-icons/bi";
import { AiOutlineYoutube, AiOutlineLink } from "solid-icons/ai";
import { Component, For, JSX, Show, createSignal, onMount } from "solid-js";

interface RefType {
  url: string;
  icon: JSX.Element;
  selected: boolean;
  category: string;
}

interface Props {
  addNostrTag(nostrTag: IRefTag): void;
}

const RefTagsSearchPanel: Component<Props> = (props) => {
  const [refTypes, setRefTypes] = createSignal<RefType[]>([
    {
      icon: <RiDocumentBook2Line size={26} />,
      selected: false,
      url: "",
      category: "books",
    },
    {
      icon: <AiOutlineYoutube size={26} />,
      selected: false,
      url: "",
      category: "videos",
    },
    {
      icon: <BiRegularCameraMovie size={26} />,
      selected: false,
      url: "",
      category: "movies",
    },
    {
      icon: <RiLogosSpotifyLine size={26} />,
      selected: false,
      url: "",
      category: "songs",
    },
    {
      icon: <AiOutlineLink size={26} />,
      selected: true,
      url: "",
      category: "generic",
    },
  ]);

  const [refTag, setRefTag] = createSignal<IRefTag>({
    category: "generic",
    value: "",
  });

  const basicStyle =
    "p-2 rounded-xl cursor-pointer group transition-scale hover:bg-slate-400 hover:text-slate-700";
  const selectedStyle = basicStyle + " bg-slate-50 text-slate-700";

  const selectRefType = (category: string) => {
    const currentRefTypes = refTypes().map((rt) => {
      const reftype: RefType = {
        icon: rt.icon,
        selected: rt.selected,
        url: rt.url,
        category: rt.category,
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
      value: inputValue,
    };
    setRefTag(updatedRefTag);
  };

  const addTag = (e: Event) => {
    e.preventDefault();
    if (refTag().value.trim() == "") {
      console.log("show a visual error here");
      return;
    }

    props.addNostrTag(refTag());
    const defaultRefTag: IRefTag = { category: refTag().category, value: "" };
    setRefTag(defaultRefTag);
  };

  return (
    <div>
      <div class="flex items-center justify-around w-5/6 mx-auto">
        <For each={refTypes()}>
          {(refType) => {
            return (
              <div
                onClick={() => selectRefType(refType.category)}
                class={refType.selected ? selectedStyle : basicStyle}
              >
                <div class="group-hover:scale-110 group-active:scale-95 transition">
                  {refType.icon}
                </div>
              </div>
            );
          }}
        </For>
      </div>

      <Show when={refTypes().find((rt) => rt.selected)?.category == "generic"}>
        <form onSubmit={addTag} class="mt-16">
          <input
            placeholder="add an external resource's URL"
            type="text"
            value={refTag().value}
            onChange={updateRefValue}
            class="block focus:outline-none mx-auto mt-10 rounded py-2 caret-slate-600
               placeholder:text-center placeholder:text-sm text-slate-500 text-center
               focus:placeholder-none"
          />
          <button class="block mx-auto w-fit mt-5 group rounded-full hover:bg-slate-600 active:bg-slate-800 p-3">
            <VsAdd size={32} class="group-hover:scale-90" />
          </button>
        </form>
      </Show>
    </div>
  );
};

export default RefTagsSearchPanel;
