import { A } from "@solidjs/router";
import { FiMail } from "solid-icons/fi";
import { RelayContext } from "~/contexts/relay";
import { CommentsContext } from "./EventWrapper";
import IEnrichedEvent from "~/interfaces/IEnrichedEvent";
import { CommentTree } from "~/lib/nostr/event-comments";
import { IReaction, Reaction } from "~/interfaces/IReaction";
import { VsArrowSmallDown, VsArrowSmallUp } from "solid-icons/vs";
import { handleReaction, parseDate } from "~/lib/nostr/nostr-utils";
import { Accessor, Component, For, JSX, Setter, Show, createSignal, useContext } from "solid-js";
import AuthWrapper from "../shared/AuthWrapper";

interface Props {
  commentTree: CommentTree;
  replyEvent: Accessor<IEnrichedEvent | undefined>;
  setReplyEvent: Setter<IEnrichedEvent>;
}

const CommentThread: Component<Props> = (props): JSX.Element => {
  const { relay, authMode } = useContext(RelayContext);
  const commentsContext = useContext(CommentsContext)!;

  const setReplyEvent = (): void => {
    props.setReplyEvent(props.commentTree.event.data);
  };

  const [show, setShow] = createSignal<boolean>(false);
  const toggle = (): void => {
    if (hasReplies()) {
      setShow(!show());
    }
  };

  const [reactions, setReactions] = createSignal<IReaction>({
    positive: props.commentTree.event.data.positive,
    negative: props.commentTree.event.data.negative
  });

  const reactToEvent = async (reaction: Reaction): Promise<void> => {
    await handleReaction(props.commentTree.event.data, reactions, setReactions, reaction, relay);
  };

  const hasReplies = (): boolean => props.commentTree.event.comments.length != 0;

  const contentStyle = (): string => {
    let baseClass = `text-base text-neutral-200 break-words rounded-md text-left mx-auto
                       bg-neutral-400 bg-opacity-25 p-3 pb-3 border border-transparent transition`;

    if (hasReplies()) {
      baseClass += " cursor-pointer hover:border-neutral-700 hover:bg-neutral-600 active:bg-opacity-40";
    }

    if (props.replyEvent() != undefined && props.replyEvent()?.id == props.commentTree.event.data.id) {
      baseClass += " border border-neutral-100";
    }

    return baseClass;
  };

  const canDeleteEvent = (): boolean => {
    if (authMode.get() != "private") {
      return false;
    }

    if (props.commentTree.event.data.pubkey == relay.userPubKey) {
      return true;
    }

    return false;
  };

  const deleteComment = async (): Promise<void> => {
    await relay.deleteEvent(props.commentTree.event.data.id);
    await commentsContext.fetchAndSetCommentsStructure(true);
  };

  return (
    <div class='my-3'>
      <div>
        <div class='text-sm text-left mb-1 w-fit rounded-md px-2 py-1 bg-slate-600'>
          <A
            href={`/users/${props.commentTree.event.data.pubkey}`}
            class='font-bold hover:underline hover:underline-offset-2'
          >
            {props.commentTree.event.data.name == "" ? "nostr user" : props.commentTree.event.data.name}
          </A>
          <span> replied on {parseDate(props.commentTree.event.data.created_at)}</span>
        </div>

        <p onClick={toggle} class={contentStyle()}>
          {props.commentTree.event.data.content}
        </p>

        <div class='flex justify-between items-center'>
          {canDeleteEvent() ? (
            <div
              onClick={deleteComment}
              class='text-sm rounded text-red-100 bg-red-800 bg-opacity-30 px-2 py-1 
                     hover:bg-opacity-60 cursor-pointer active:scale-95 select-none'
            >
              delete comment
            </div>
          ) : (
            <></>
          )}

          <AuthWrapper
            fallback={
              <div class='flex justify-end items-center gap-x-3 px-2 py-1 mt-1 rounded-md w-fit ml-auto bg-slate-600'>
                <div class='flex items-center  rounded-md'>
                  <span class='text-sm ml-1'>{reactions().positive.count}</span>
                  <VsArrowSmallUp size={26} />
                </div>

                <div class='flex items-center  rounded-md'>
                  <span class='text-sm ml-1'>{reactions().negative.count}</span>
                  <VsArrowSmallDown size={26} />
                </div>

                <div onClick={setReplyEvent} class=' rounded-md px-2 py-1'>
                  <FiMail />
                </div>
              </div>
            }
          >
            <div class='flex justify-end items-center gap-x-3 px-2 py-1 mt-1 rounded-md w-fit ml-auto bg-slate-600'>
              <div
                onClick={() => reactToEvent("+")}
                class='flex items-center hover:bg-slate-700 cursor-pointer rounded-md'
              >
                <span class='text-sm ml-1'>{reactions().positive.count}</span>
                <VsArrowSmallUp size={26} />
              </div>

              <div
                onClick={() => reactToEvent("-")}
                class='flex items-center hover:bg-slate-700 cursor-pointer rounded-md active:bg-opacity-50'
              >
                <span class='text-sm ml-1'>{reactions().negative.count}</span>
                <VsArrowSmallDown size={26} />
              </div>

              <div
                onClick={setReplyEvent}
                class='hover:bg-slate-700 cursor-pointer rounded-md active:bg-opacity-50 px-2 py-1'
              >
                <FiMail />
              </div>
            </div>
          </AuthWrapper>
        </div>
      </div>

      <Show when={show()}>
        <div class='ml-14'>
          <For each={props.commentTree.event.comments}>
            {(cmtTree) => (
              <CommentThread
                replyEvent={props.replyEvent}
                setReplyEvent={props.setReplyEvent}
                commentTree={cmtTree}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default CommentThread;
