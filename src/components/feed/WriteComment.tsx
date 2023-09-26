import { VsSend } from "solid-icons/vs";
import { RelayContext } from "~/contexts/relay";
import { CommentsContext } from "./EventWrapper";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { Accessor, Component, JSX, Setter, createSignal, useContext } from "solid-js";

interface Props {
  replyEvent: Accessor<IEnrichedEvent | undefined>;
  setReplyEvent: Setter<IEnrichedEvent | undefined>;
}

const WriteComment: Component<Props> = (props): JSX.Element => {
  const { relay } = useContext(RelayContext);
  const commentsContext = useContext(CommentsContext)!;

  const [content, setContent] = createSignal<string>("");

  const helperMessage = (): string => {
    if (props.replyEvent() == undefined) {
      return "main post";
    }

    return props.replyEvent()!.content.length > 30
      ? `"${props.replyEvent()!.content.substring(0, 30)}..."`
      : props.replyEvent()!.content;
  };

  const clearReplyEvent = (): void => {
    props.setReplyEvent();
  };

  const updateContent = (e: Event) => {
    const textAreaContent = (e.currentTarget as HTMLInputElement).value;
    setContent(textAreaContent);
  };

  const signEventAndReply = async (): Promise<void> => {
    const pubRes = await relay.replyToEvent(
      content(),
      props.replyEvent() ?? commentsContext.rootEvent!,
      commentsContext.rootEvent!
    );

    if (!pubRes.error) {
      await commentsContext.fetchAndSetCommentsStructure();
    } else {
      console.log("Event reply did not go through, try again");
    }
  };

  return (
    <div class='mr-4 border-t border-neutral-400 border-opacity-50 pt-1'>
      <div class='flex justify-center items-stretch'>
        <div class='w-4/5'>
          <textarea
            class='block placeholder:text-lg text-lg focus:outline-none bg-slate-500 bg-opacity-10 
            hover:bg-opacity-20 focus:bg-opacity-25 mx-auto text-slate-300 caret-orange-200 resize-none 
            custom-scrollbar px-5 py-2 rounded-md w-full'
            rows={2}
            onInput={updateContent}
            placeholder='write your reply'
          ></textarea>

          <div class='flex items-center justify-between py-1'>
            <div class='text-sm text-neutral-300 bg-slate-700 rounded px-2 py-1'>
              Replying to: <span class='underline underline-offset-4 ml-5'>{helperMessage()}</span>
            </div>
            {props.replyEvent() != undefined ? (
              <div
                onClick={clearReplyEvent}
                class='text-sm text-neutral-300 bg-slate-700 rounded px-2 py-1 cursor-pointer hover:text-white'
              >
                <p class='active:scale-95'>reply to main post instead</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div
          onClick={signEventAndReply}
          class='relative text-orange-300 mx-auto group cursor-pointer hover:bg-neutral-600 rounded-md w-1/6'
        >
          <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <VsSend size={40} class='w-fit mx-auto group-hover:scale-110 group-active:scale-90 transition' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteComment;
