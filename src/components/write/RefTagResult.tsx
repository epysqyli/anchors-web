import { Component } from "solid-js";
import { IRefTag } from "~/interfaces/IRefTag";
import IRefTagResult from "~/interfaces/IRefTagResult";

interface Props {
  result: IRefTagResult;
  addTag(tag: IRefTag): void;
}

const RefTagResult: Component<Props> = (props) => {
  const result = () => props.result;

  return (
    <div
      onClick={() => props.addTag({ category: result().category, value: result().url })}
      class='flex justify-between py-2 px-2 my-2 bg-slate-800 rounded mx-2 gap-x-5'
    >
      <div class='w-1/5'>
        {result().preview != "" ? <img src={result().preview} /> : <div class='bg-slate-500'></div>}
      </div>
      <div class='text-right w-4/5'>
        <div class='text-sm text-slate-100'>{result().title}</div>
        <div class='text-xs text-slate-400 mt-2'>{result().creator}</div>
      </div>
    </div>
  );
};

export default RefTagResult;
