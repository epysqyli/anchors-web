import { BsBook } from "solid-icons/bs";
import { RiLogosSpotifyLine } from "solid-icons/ri";
import { BiRegularCameraMovie } from "solid-icons/bi";
import { Component, For, JSX, createSignal, onMount } from "solid-js";
import { AiOutlineYoutube, AiOutlineLink } from "solid-icons/ai";

interface RefType {
  url: string;
  icon: JSX.Element;
  selected: boolean;
  category: string;
}

const RefsSearch: Component<{}> = (props) => {
  const [refTypes, setRefTypes] = createSignal<RefType[]>([
    {
      icon: <BsBook size={26} />,
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

  const basicStyle =
    "p-2 rounded-md cursor-pointer hover:scale-105 active:scale-95 transition";
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
                {refType.icon}
              </div>
            );
          }}
        </For>
      </div>

      <input
        placeholder="search API based on resource"
        type="text"
        class="block focus:outline-none mx-auto mt-10 rounded py-2 caret-slate-600
               placeholder:text-center placeholder:text-sm text-slate-500 text-center
               focus:placeholder-none"
      />
    </div>
  );
};

export default RefsSearch;
