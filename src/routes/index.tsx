import { Component } from "solid-js";
import { IoCaretForward } from "solid-icons/io";

const Home: Component<{}> = () => {
  return (
    <>
      <div class="h-full flex gap-x-3 px-2 justify-center items-center">
        {/* user menu */}
        <div
          class="h-[98vh] w-1/4 rounded-md pt-10 text-lg
                    bg-gradient-to-br from-slate-600
                    via-slate-700 via-20% 
                    to-gray-900 to-90% relative
                    overflow-y-auto"
        >
          <div>
            <div
              class="flex items-center gap-x-10 text-slate-50 w-5/6 mx-auto my-2
                      hover:bg-slate-600 p-4 rounded-md transition cursor-pointer
                      hover:scale-95 active:scale-90"
            >
              <IoCaretForward />
              <div>write</div>
            </div>
            <div
              class="flex items-center gap-x-10 text-slate-50 w-5/6 mx-auto my-2
                      hover:bg-slate-600 p-4 rounded-md transition cursor-pointer
                      hover:scale-95 active:scale-90"
            >
              <IoCaretForward />
              <div>search posts</div>
            </div>
            <div
              class="flex items-center gap-x-10 text-slate-50 w-5/6 mx-auto my-2
                      hover:bg-slate-600 p-4 rounded-md transition cursor-pointer
                      hover:scale-95 active:scale-90"
            >
              <IoCaretForward />
              <div>update profile</div>
            </div>
            <div
              class="flex items-center gap-x-10 text-slate-50 w-5/6 mx-auto my-2
                      hover:bg-slate-600 p-4 rounded-md transition cursor-pointer
                      hover:scale-95 active:scale-90"
            >
              <IoCaretForward />
              <div>manage relays</div>
            </div>
            <div
              class="flex items-center gap-x-10 text-slate-50 w-5/6 mx-auto my-2
                      hover:bg-slate-600 p-4 rounded-md transition cursor-pointer
                      hover:scale-95 active:scale-90"
            >
              <IoCaretForward />
              <div>manage following</div>
            </div>
            <div
              class="flex items-center gap-x-10 text-slate-50 w-5/6 mx-auto my-2
                      hover:bg-slate-600 p-4 rounded-md transition cursor-pointer
                      hover:scale-95 active:scale-90"
            >
              <IoCaretForward />
              <div>chats</div>
            </div>

            <div class="text-sm text-slate-300 text-center border border-dashed p-5 w-3/4 
                        mx-auto mt-10 rounded">
              show which relays are being used and other similar stats
            </div>
          </div>
        </div>

        {/* nostr event */}
        <div
          class="h-[98vh] w-3/4 rounded-md bg-gradient-to-bl from-slate-700
                  via-slate-700 via-20% 
                  to-gray-800 to-80%"
        >
          <div class="snap-y snap-mandatory overflow-scroll overflow-x-hidden h-[98vh]">
            <div class="snap-start h-[98vh] text-white text-2xl p-10 mx-auto w-4/5">
              <div class="h-[80vh] rounded-md">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi
                vero iusto totam dolores suscipit similique quis placeat et
                ipsam neque. Necessitatibus adipisci consequuntur quidem iure
                vero repudiandae assumenda quia et?
              </div>
            </div>
            <div class="snap-start h-[98vh] text-white text-2xl p-10 mx-auto w-4/5">
              <div class="h-[80vh] rounded-md">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima
                optio, a suscipit iusto laborum beatae ipsum veniam expedita
                obcaecati soluta officia in dolores, et voluptatum omnis
                similique neque! Maiores, temporibus!
              </div>
            </div>
            <div class="snap-start h-[98vh] text-white text-2xl p-10 mx-auto w-4/5">
              <div class="h-[80vh] rounded-md">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Provident molestias sunt aut. Maiores, ullam ex! Vitae non a in
                magnam accusantium soluta adipisci aspernatur alias, ut
                molestias, architecto perferendis id!
              </div>
            </div>
            <div class="snap-start h-[98vh] text-white text-2xl p-10 mx-auto w-4/5">
              <div class="h-[80vh] rounded-md">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa
                dignissimos repellendus excepturi nihil sit veritatis suscipit,
                dolores vero provident tempore nobis, aperiam beatae
                reprehenderit culpa quasi. Eum iure doloremque fugit?
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
