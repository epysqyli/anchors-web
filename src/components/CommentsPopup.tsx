import { Component, JSX } from "solid-js";

interface Props {}

const CommmentsPopup: Component<Props> = (props): JSX.Element => {
  return (
    <div>
      <h2 class='text-slate-100 text-center text-2xl md:text-4xl font-bold'>Comments</h2>
    </div>
  );
};

export default CommmentsPopup;
