import { VsLoading } from "solid-icons/vs";
import { VoidComponent } from "solid-js";

// setup a nicer fullscreen pulsing animation
const LoadingFallback: VoidComponent = () => {
  return (
    <div class='animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <VsLoading size={100} color='white' class='animate-spin' />
    </div>
  );
};

export default LoadingFallback;
