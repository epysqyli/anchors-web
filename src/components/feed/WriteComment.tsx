import { VsSend } from "solid-icons/vs";
import { RelayContext } from "~/contexts/relay";
import { CommentsContext } from "./EventWrapper";
import { useIsNarrow } from "~/hooks/useMediaQuery";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { Accessor, Component, JSX, Setter, Show, createSignal, useContext } from "solid-js";

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

  const isReplyValid = (): boolean => {
    if (!relay.userPubKey) {
      console.log("No pubkey, nostr extension missing");
      return false;
    }

    if (props.replyEvent() == undefined && commentsContext.rootEvent.pubkey == relay.userPubKey) {
      console.log("Cannot directly reply to your own post");
      return false;
    }

    if (content().trim().length == 0) {
      console.log("Cannot post an empty reply");
      return false;
    }

    return true;
  };

  const signEventAndReply = async (): Promise<void> => {
    if (!isReplyValid()) {
      return;
    }

    const pubRes = await relay.replyToEvent(
      content(),
      props.replyEvent() ?? commentsContext.rootEvent!,
      commentsContext.rootEvent!
    );

    if (!pubRes.error) {
      await commentsContext.fetchAndSetCommentsStructure(false);
      setContent("");
      props.setReplyEvent();
    } else {
      console.log("Event reply did not go through, try again");
    }
  };

  return (
    <>
      <Show when={useIsNarrow() !== undefined && useIsNarrow()}>
        <div class='border-t border-slate-400 border-opacity-50 pt-2 px-5'>
          <div class='flex justify-center items-stretch'>
            <textarea
              class='block placeholder:text-base text-base focus:outline-none bg-slate-500 bg-opacity-10 
                       focus:bg-opacity-25 mx-auto text-slate-300 caret-orange-200 resize-none 
                       px-5 py-2 rounded-md w-4/5'
              rows={2}
              onInput={updateContent}
              placeholder='write your reply'
              value={content()}
            ></textarea>

            <div onClick={signEventAndReply} class='relative text-orange-300 mx-auto group rounded-md w-1/6'>
              <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <VsSend
                  size={40}
                  class='w-fit mx-auto group-hover:scale-110 group-active:scale-90 transition'
                />
              </div>
            </div>
          </div>

          <div class='flex items-center justify-between gap-x-2 py-1 mt-2'>
            <div class='text-sm text-neutral-300 bg-slate-700 rounded px-2 py-1 text-left'>
              Replying to: <span class='underline underline-offset-4 ml-5'>{helperMessage()}</span>
            </div>

            {props.replyEvent() != undefined ? (
              <div
                onClick={clearReplyEvent}
                class='text-sm text-right text-neutral-300 bg-slate-700 rounded px-2 py-1'
              >
                <p class='active:scale-95'>reply to main post instead</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Show>

      <Show when={useIsNarrow() !== undefined && !useIsNarrow()}>
        <div class='mr-4 border-t border-slate-400 border-opacity-50 pt-2'>
          <div class='flex justify-center items-stretch'>
            <div class='w-4/5'>
              <textarea
                class='block placeholder:text-lg text-lg focus:outline-none bg-slate-500 bg-opacity-10 
            hover:bg-opacity-20 focus:bg-opacity-25 mx-auto text-slate-300 caret-orange-200 resize-none 
            md:custom-scrollbar px-5 py-2 rounded-md w-full'
                rows={2}
                onInput={updateContent}
                placeholder='write your reply'
                value={content()}
              ></textarea>

              <div class='flex items-center justify-between py-1 mt-2'>
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
                <VsSend
                  size={40}
                  class='w-fit mx-auto group-hover:scale-110 group-active:scale-90 transition'
                />
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default WriteComment;
