import { Component } from "solid-js";
import { IRefTag } from "~/interfaces/IRefTag";
import { BsBookmarkPlusFill } from "solid-icons/bs";

interface Props {
  result: IRefTag;
  addTag(tag: IRefTag): void;
}

const RefTagResult: Component<Props> = (props) => {
  const result = () => props.result;

  return (
    <div
      onClick={() => props.addTag(result())}
      class='flex justify-between py-2 px-2 my-2 group border-orange-400 border-opacity-40 border-b
             mx-2 gap-x-5 transition cursor-pointer active:scale-95 active:bg-slate-500 hover:border-opacity-100'
    >
      <div class='w-1/5'>
        {result().preview != "" ? (
          <img src={result().preview} loading="lazy" />
        ) : (
          <div class='bg-slate-500 h-full rounded'></div>
        )}
      </div>

      <div class='text-right w-4/5'>
        <div class='text-sm md:text-base text-slate-100'>{result().title}</div>
        <div class='text-xs md:text-sm text-slate-400 mt-2'>{result().additionalInfoOne}</div>
        <div class='text-xs md:text-sm text-slate-400 mt-2'>{result().additionalInfoTwo}</div>
      </div>

      <BsBookmarkPlusFill
        size={22}
        class='text-slate-200 group-hover:scale-125 group-active:scale-100 transition'
      />
    </div>
  );
};

export default RefTagResult;
