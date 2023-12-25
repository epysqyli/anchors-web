import { TbPlus } from "solid-icons/tb";
import { RelayContext } from "~/contexts/relay";
import { RiSystemCloseCircleFill } from "solid-icons/ri";
import { Accessor, Component, For, JSX, Show, useContext } from "solid-js";
import AuthWrapper from "../shared/AuthWrapper";

interface Props {
  listType: "r" | "w" | "rw";
  isLoading: Accessor<boolean>;
  relayList: Accessor<string[]>;
  handleSubmit(e: Event): Promise<void>;
  handleDeletion(relayType: "r" | "w" | "rw", relayAddress: string): Promise<void>;
}

const RelayForm: Component<Props> = (props): JSX.Element => {
  const { authMode } = useContext(RelayContext);

  return (
    <div class='flex flex-col justify-between col-span-1 bg-slate-700 bg-opacity-50 rounded pb-1 h-full mb-3 md:mb-0 snap-start'>
      <h2 class='text-center uppercase tracking-tight py-3 text-slate-300 text-lg font-bold bg-slate-600 rounded mb-3'>
        {{ r: "Read From", w: "Write To", rw: "Read & Write" }[props.listType]}
      </h2>

      <div class='grow py-5 overflow-y-scroll md:custom-scrollbar h-[1vh]'>
        <Show
          when={!props.isLoading()}
          fallback={
            <>
              <div class='bg-slate-600 h-[10%] my-2 w-4/5 animate-pulse rounded-md mx-auto'></div>
              <div class='bg-slate-600 h-[10%] my-2 w-4/5 animate-pulse rounded-md mx-auto'></div>
              <div class='bg-slate-600 h-[10%] my-2 w-4/5 animate-pulse rounded-md mx-auto'></div>
              <div class='bg-slate-600 h-[10%] my-2 w-4/5 animate-pulse rounded-md mx-auto'></div>
              <div class='bg-slate-600 h-[10%] my-2 w-4/5 animate-pulse rounded-md mx-auto'></div>
            </>
          }
        >
          <For each={props.relayList()}>
            {(relayAddress) => (
              <div class='flex items-center justify-between w-11/12 mx-auto my-1 py-2 px-2 bg-slate-600 hover:bg-slate-400 hover:bg-opacity-25 rounded bg-opacity-25'>
                <div class='text-slate-300'>{relayAddress}</div>
                <AuthWrapper>
                  <div
                    onClick={() => props.handleDeletion(props.listType, relayAddress)}
                    class='text-red-400 text-opacity-40 hover:text-red-400 hover:text-opacity-100 cursor-pointer hover:scale-105 active:scale-95'
                  >
                    <RiSystemCloseCircleFill size={30} />
                  </div>
                </AuthWrapper>
              </div>
            )}
          </For>
        </Show>
      </div>

      <AuthWrapper>
        <form onSubmit={props.handleSubmit} class='flex items-center justify-around py-2 px-1'>
          <input
            id='reading'
            type='text'
            name={props.listType}
            pattern='^wss.*'
            class='block w-4/5 py-2 rounded focus:outline-none bg-slate-500 bg-opacity-75 text-center caret-slate-200 text-slate-200'
          />
          <button class='block h-full text-green-400 text-opacity-50 hover:text-opacity-100 transition-all hover:scale-105 active:scale-95'>
            <TbPlus size={42} stroke-width={1.5} class='mx-auto' />
          </button>
        </form>
      </AuthWrapper>
    </div>
  );
};

export default RelayForm;
