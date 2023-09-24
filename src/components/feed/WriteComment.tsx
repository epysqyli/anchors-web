import { VsSend } from "solid-icons/vs";
import { RelayContext } from "~/contexts/relay";
import { RootEventContext } from "./EventWrapper";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { Component, JSX, createSignal, useContext } from "solid-js";

interface Props {
  replyEvent: IEnrichedEvent;
}

const WriteComment: Component<Props> = (props): JSX.Element => {
  const { relay } = useContext(RelayContext);
  const rootEventContext = useContext(RootEventContext);

  const [content, setContent] = createSignal<string>("");

  const updateContent = (e: Event) => {
    const textAreaContent = (e.currentTarget as HTMLInputElement).value;
    setContent(textAreaContent);
  };

  const signEventAndReply = async (): Promise<void> => {
    const pubRes = await relay.replyToEvent(content(), props.replyEvent, rootEventContext?.rootEvent!);

    if (!pubRes.error) {
      await rootEventContext?.fetchAndSetCommentsStructure();
    } else {
      console.log("Event reply did not go through, try again");
    }
  };

  return (
    <div>
      <h3 class='text-2xl mt-3'>Write a comment</h3>
      <textarea
        class='block w-full placeholder:text-center placeholder:text-lg text-lg 
              focus:outline-none bg-slate-500 bg-opacity-10 hover:bg-opacity-20 focus:bg-opacity-25 
              mx-auto text-slate-300 caret-orange-200 resize-none 
              custom-scrollbar px-5 py-2 mt-5 rounded-md'
        rows={6}
        onInput={updateContent}
      ></textarea>

      <div
        onClick={signEventAndReply}
        class=' text-orange-300 mx-auto py-6 mt-5 group cursor-pointer hover:bg-neutral-600 rounded-md w-2/5'
      >
        <VsSend size={40} class='w-fit mx-auto group-hover:scale-110 group-active:scale-90 transition' />
      </div>
    </div>
  );
};

export default WriteComment;
