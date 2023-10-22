import { JSX, VoidComponent } from "solid-js";
import { TbCreativeCommonsZero } from "solid-icons/tb";

const NoEvents: VoidComponent = (): JSX.Element => {
  return (
    <div class='relative snap-start h-full text-slate-300'>
      <div
        class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
             p-20 border rounded-full border-slate-600 text-slate-300
             hover:shadow-lg shadow-slate-500'
      >
        <TbCreativeCommonsZero size={80} class='mx-auto' stroke-width={1} />
        <p class='text-center mt-10 text-lg select-none w-1/2 mx-auto'>No more posts in this feed</p>
      </div>
    </div>
  );
};

export default NoEvents;