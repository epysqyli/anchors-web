import { A } from "solid-start";
import { JSX, VoidComponent } from "solid-js";

const WhatIsAnchors: VoidComponent = (): JSX.Element => {
  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold py-5 md:py-10'>
        What is Anchors?
      </h1>

      <div class='md:w-4/5 2md:w-3/5 mx-auto h-4/5 overflow-y-scroll md:custom-scrollbar px-10 text-slate-300'>
        <h3 class='text-xl mt-5 mb-2 underline underline-offset-4'>Anchors is a Nostr app</h3>
        <p class='mb-5 text-justify tracking-tight md:tracking-normal text-base'>
          <A class='underline' href='https://nostr.com/' target='_blank'>
            Nostr
          </A>{" "}
          is an open protocol for decentralized and censorship-resistant social media. Anchors is a Nostr
          client that implements the core parts of this protocol in order to allow users to share and fetch
          notes (traditionally called posts) to and from Nostr relays.
        </p>

        <p class='mb-5 text-justify tracking-tight md:tracking-normal text-base'>
          Examples of already established nostr clients can be found{" "}
          <A class='underline' href='https://github.com/aljazceru/awesome-nostr' target='_blank'>
            at this Github link
          </A>
          .
        </p>

        <h3 class='text-xl mt-5 mb-2 underline underline-offset-4'>Why Anchors</h3>
        <p class='mb-5 text-justify tracking-tight md:tracking-normal text-base'>
          The goal of Anchors is that of providing a minimalistic social network experience centered around
          sharing notes <b>based on other references</b>: this means that a note can never be written and
          posted to the nostr relays if it's devoid of reference tags.
        </p>

        <p class='mb-5 text-justify tracking-tight md:tracking-normal text-base'>
          A reference is nothing but a link to an external resource: it might be an article, a podcast, a
          song, a book, etc. that prompted the idea that the user wants to write down and share with the rest
          of the network. This constraint is in place because the aim of Anchors is not that of being a clone
          of existing social media, where people randomly share whatever comes to mind, but instead wants to
          be a platform where users share the precious insights that they come up with while, for example,
          reading a particular book or article.
        </p>

        <p class='mb-5 text-justify tracking-tight md:tracking-normal text-base'>
          With references in place anchoring ideas, users can then check all the other ideas that have the
          same reference as their basis. This will hopefully create a place where interesting concepts can be
          explored without users drowning in a sea of noise.
        </p>

        <h3 class='text-xl mt-5 mb-2 underline underline-offset-4'>Why on Nostr</h3>
        <p class='mb-5 text-justify tracking-tight md:tracking-normal text-base'>
          This app could have been built with a centralized database at its core, but centralization means
          control: creating an app where ideas are crucial and making it dependent on a centralized database
          means that users can potentially lose access to the ideas shared via posts. Nostr prevents this via
          its network of relays.
        </p>

        <p class='mb-5 text-justify tracking-tight md:tracking-normal text-base'>
          Moreover, being on Nostr, all Nostr users can use their existing identities to use Anchors without
          needing to create a new profile in a closed network that would probably never garner attention on
          its own.
        </p>

        <h3 class='text-xl mt-5 mb-2 underline underline-offset-4'>How to get started</h3>
        <p class='mb-5 text-justify tracking-tight md:tracking-normal text-base'>
          Create a public/private key pair using an extension like{" "}
          <A
            class='underline'
            href='https://chromewebstore.google.com/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp?pli=1'
            target='_blank'
          >
            nos2x
          </A>{" "}
          on Chrome. This allows you to keep your private key safe and use it to sign notes minimizing its
          exposure to the browser. Other similar extensions exist for both Chrome and other browsers.
        </p>

        <p class="class='mb-5 text-justify tracking-tight md:tracking-normal text-base'">
          On mobile, you can still use nostr signer extensions as detailed{" "}
          <A
            class='underline'
            target='_blank'
            href='https://orangepill.dev/nostr-guides/guide-nostr-key-generation-and-management/#steps-to-setup-and-use-on-android-devices'
          >
            on this page
          </A>
          .
        </p>
      </div>
    </>
  );
};

export default WhatIsAnchors;
