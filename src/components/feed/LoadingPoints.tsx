import { VoidComponent } from "solid-js";

const LoadingPoints: VoidComponent = () => {
  return (
    <div class='animate-pulse text-slate-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2'>
      {Array.from({ length: 15 }).map((_) => {
        return (
          <div class='flex justify-around'>
            {Array.from({ length: 10 }).map((_) => {
              return <span class='text-4xl'>.</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default LoadingPoints;
