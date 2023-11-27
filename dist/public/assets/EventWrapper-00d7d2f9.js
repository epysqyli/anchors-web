import{k as q,u as K,R as le,b as L,l as f,g as a,a as d,i as n,c as t,G as $,a6 as Re,a7 as Te,r as k,t as c,a8 as at,o as ke,m as ue,E as be,S as p,U as Pe,F as oe,p as _e,s as ce,a9 as gt,n as re,K as ve,aa as Ie,ab as mt,ac as vt,Q as ze,ad as Le,ae as Ue,af as Fe,ag as De,ah as fe,I as Ae,ai as $t,A as Se,H as ht,aj as ft,q as xt,M as Me,ak as je,al as Ne,h as bt,N as _t,a5 as He,P as xe,am as pt}from"./entry-client-70f5ea60.js";import{f as Ke,g as Be}from"./index-c5d10f7a.js";import{R as yt,f as wt,c as St,d as Ct}from"./open-library-64fefcf2.js";const kt=c('<div class="flex items-center gap-x-2 text-slate-400"><div><!#><!/><p class="text-center text-sm mt-1"></p></div><div><!#><!/><p class="text-center text-sm mt-1">'),Et=c('<div class="flex items-center gap-x-2 text-slate-400"><div class="cursor-pointer hover:text-slate-200 hover:scale-105 active:scale-95 transition-all"><!#><!/><p class="text-center text-sm mt-1"></p></div><div class="cursor-pointer hover:text-slate-200 hover:scale-105 active:scale-95 transition-all"><!#><!/><p class="text-center text-sm mt-1">'),Ve=e=>{const{relay:r,authMode:s}=K(le),[l,i]=L({positive:e.event.positive,negative:e.event.negative}),b=v=>l()[v].events.find(h=>h.pubkey==r.userPubKey)!==void 0,o=f(()=>b("positive")),u=f(()=>b("negative")),g=async v=>{await at(e.event,l,i,v,r)};return s.get()!="private"?(()=>{const v=a(kt),x=v.firstChild,h=x.firstChild,[m,S]=d(h.nextSibling),R=m.nextSibling,_=x.nextSibling,E=_.firstChild,[T,U]=d(E.nextSibling),F=T.nextSibling;return n(x,t(Re,{get size(){return $()?21:26},get fill(){return o()?"white":""},get"fill-opacity"(){return o()?"0.7":"0"}}),m,S),n(R,()=>l().positive.count),n(_,t(Te,{get size(){return $()?21:26},get fill(){return u()?"white":""},get"fill-opacity"(){return u()?"0.7":"0"}}),T,U),n(F,()=>l().negative.count),v})():(()=>{const v=a(Et),x=v.firstChild,h=x.firstChild,[m,S]=d(h.nextSibling),R=m.nextSibling,_=x.nextSibling,E=_.firstChild,[T,U]=d(E.nextSibling),F=T.nextSibling;return x.$$click=()=>g("+"),n(x,t(Re,{get size(){return $()?21:26},get fill(){return o()?"white":""},get"fill-opacity"(){return o()?"0.7":"0"}}),m,S),n(R,()=>l().positive.count),_.$$click=()=>g("-"),n(_,t(Te,{get size(){return $()?21:26},get fill(){return u()?"white":""},get"fill-opacity"(){return u()?"0.7":"0"}}),T,U),n(F,()=>l().negative.count),k(),v})()};q(["click"]);const Rt=c('<h2 class="text-center mb-5">Recent posts'),Tt=c('<div class="h-screen w-screen bg-slate-800 bg-opacity-95"><div class="w-5/6 mx-auto py-10 h-full"><!#><!/><p class="text-sm rounded text-left my-10 text-neutral-300 px-2 py-2 h-1/4 overflow-y-auto"></p><!#><!/><!#><!/>'),Pt=c('<h2 class="mb-5 w-fit mx-auto px-5">Recent posts'),It=c('<div class="mx-auto h-full"><div class="flex items-start justify-around gap-x-10 h-4/5 pt-20"><div class="w-1/2 h-full"><!#><!/><p class="mx-auto text-sm text-neutral-200 text-opacity-75 pt-3 pr-2 mt-5 h-2/3 overflow-y-auto xl:custom-scrollbar"></p></div><div class="w-1/2"></div></div><!#><!/>'),zt=c('<div class="my-5 h-1/4 relative scale-50">'),Oe=c('<div class="text-sm break-all mb-2 hover:bg-slate-700 active:scale-95 rounded-md p-1"><div class="text-neutral-300 mb-1 text-left"></div><div class="text-neutral-400 text-left">'),Lt=c('<div class="mx-auto w-fit mt-10"><div class="border w-fit mx-auto p-5 rounded-full border-opacity-25 border-slate-300 cursor-pointer transition-all group active:border-opacity-80 hover:bg-slate-500">'),Ut=c('<div class="mt-20 relative scale-50">'),Ft=c('<div class="mx-auto w-fit"><div class="border w-fit mx-auto p-5 rounded-full border-opacity-25 border-slate-300 cursor-pointer transition-all group active:border-opacity-80 hover:bg-slate-500">'),Ge=e=>{const{relay:r,authMode:s}=K(le),[l,i]=L([]),[b,o]=L(!1),[u,g]=L(!r.isUserAlreadyFollowed(e.pubkey)),v=async()=>{u()?(await r.followUser([...r.following,e.pubkey])).error?console.log("error following user"):g(!1):(await r.followUser(r.following.filter(m=>m!==e.pubkey))).error?console.log("error unfollowing user"):g(!0)},x=()=>s.get()=="private"&&r.userPubKey!=e.pubkey;return ke(async()=>{o(!0),i(await r.fetchTextEvents({rootOnly:!0,isAnchorsMode:!1,filter:{authors:[e.pubkey]},postFetchLimit:3})),o(!1)}),[t(p,{get when(){return f(()=>$()!=null)()&&$()},get children(){const h=a(Tt),m=h.firstChild,S=m.firstChild,[R,_]=d(S.nextSibling),E=R.nextSibling,T=E.nextSibling,[U,F]=d(T.nextSibling),P=U.nextSibling,[D,I]=d(P.nextSibling);return n(m,t(ue,{get href(){return`/users/${e.pubkey}`},get children(){return t(be,{get name(){return e.name},get about(){return e.about},get picture(){return e.picture},get pubKey(){return e.pubkey},layout:"h"})}}),R,_),n(E,()=>e.about),n(m,t(p,{get fallback(){return(()=>{const C=a(zt);return n(C,t(Pe,{})),C})()},get when(){return!b()},get children(){return[a(Rt),t(oe,{get each(){return l()},children:C=>t(ue,{get href(){return`/events/${C.id}`},get children(){const z=a(Oe),A=z.firstChild,W=A.nextSibling;return n(A,()=>_e(C.created_at)),n(W,()=>ce(C.content,100)),z}})})]}}),U,F),n(m,(()=>{const C=f(()=>!!x());return()=>C()?(()=>{const z=a(Lt),A=z.firstChild;return A.$$click=v,n(A,(()=>{const W=f(()=>!!u());return()=>W()?t(Ke,{size:28,class:"mx-auto hover:scale-105 active:scale-95"}):t(Be,{size:28,class:"mx-auto hover:scale-105 active:scale-95"})})()),k(),z})():[]})(),D,I),h}}),t(p,{get when(){return f(()=>$()!=null)()&&!$()},get children(){const h=a(It),m=h.firstChild,S=m.firstChild,R=S.firstChild,[_,E]=d(R.nextSibling),T=_.nextSibling,U=S.nextSibling,F=m.nextSibling,[P,D]=d(F.nextSibling);return n(S,t(ue,{get href(){return`/users/${e.pubkey}`},class:"hover:text-neutral-400 active:text-neutral-300",get children(){return t(be,{get name(){return e.name},get about(){return e.about},get picture(){return e.picture},get pubKey(){return e.pubkey},layout:"h"})}}),_,E),n(T,()=>e.about),n(U,t(p,{get fallback(){return(()=>{const I=a(Ut);return n(I,t(Pe,{})),I})()},get when(){return!b()},get children(){return[a(Pt),t(oe,{get each(){return l()},children:I=>t(ue,{get href(){return`/events/${I.id}`},get children(){const C=a(Oe),z=C.firstChild,A=z.nextSibling;return n(z,()=>_e(I.created_at)),n(A,()=>ce(I.content,100)),C}})})]}})),n(h,(()=>{const I=f(()=>!!x());return()=>I()?(()=>{const C=a(Ft),z=C.firstChild;return z.$$click=v,n(z,(()=>{const A=f(()=>!!u());return()=>A()?t(Ke,{size:32,class:"mx-auto hover:scale-105 active:scale-95"}):t(Be,{size:32,class:"mx-auto hover:scale-105 active:scale-95"})})()),k(),C})():[]})(),P,D),h}})]};q(["click"]);const We=e=>{const r=()=>gt().pathname.includes(e.nostrEventID)?"text-sm break-all w-1/2 xl:w-1/6 text-slate-400 bg-slate-700 px-2 py-1 rounded cursor-default":`text-sm break-all xl:w-1/5 text-slate-400 cursor-pointer bg-slate-700
            px-2 py-1 rounded hover:text-slate-200 active:scale-95 transition-all`;return t(ue,{get class(){return r()},get href(){return`/events/${e.nostrEventID}`},get children(){return f(()=>!!$())()?ce(e.nostrEventID,32):e.nostrEventID}})},Dt=c('<div class="h-full w-full"><div class="h-[8%] mb-[2%] mx-auto py-2 bg-orange-500 bg-opacity-30 w-full text-sm text-center rounded-md">repost by <span class="underline underline-offset-2"></span></div><div class="h-[90%] pr-5 py-3 pl-2 bg-slate-800 bg-opacity-40 rounded-md overflow-y-scroll">'),At=c('<div class="pr-5 py-3 pl-2 bg-slate-800 bg-opacity-40 rounded-md h-full">'),Mt=c("<div><!#><!/><!#><!/>"),jt=c('<div class="col-span-4 xl:col-span-4 h-full overflow-y-hidden"><div class="h-[9%] relative bg-slate-500 bg-opacity-30 rounded-md mb-[1%]"><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base text-slate-300 w-full text-center">repost by <span class="underline underline-offset-2 cursor-pointer"></span></div></div><div class="w-full bg-neutral-900 bg-opacity-30 rounded-md mx-auto text-slate-300 tracking-tighter py-10 break-words whitespace-pre-line h-[90%]"><p class="w-5/6 px-5 mx-auto overflow-y-scroll xl:custom-scrollbar h-full">'),Nt=c('<div class="col-span-4 xl:col-span-4 bg-neutral-900 bg-opacity-30 rounded-md h-full overflow-y-hidden py-10"><p class="w-5/6 px-5 mx-auto text-slate-300 tracking-tighter break-words whitespace-pre-line overflow-y-scroll xl:custom-scrollbar h-full">'),qe=e=>{const r=()=>{e.setUserPopupProps({name:e.reposter().name,about:e.reposter().about,pubkey:e.event.repostEvent.pubkey,picture:e.reposter().picture}),e.setShowUserPopup(!0)};return[t(p,{get when(){return f(()=>$()!=null)()&&$()},get children(){const s=a(Mt),l=s.firstChild,[i,b]=d(l.nextSibling),o=i.nextSibling,[u,g]=d(o.nextSibling);return n(s,t(p,{get when(){return e.event.isRepost},get children(){const v=a(Dt),x=v.firstChild,h=x.firstChild,m=h.nextSibling,S=x.nextSibling;return m.$$click=r,n(m,()=>e.reposter()?.name??"npub"),n(S,()=>e.event.content),k(),v}}),i,b),n(s,t(p,{get when(){return!e.event.isRepost},get children(){const v=a(At);return n(v,()=>e.event.content),v}}),u,g),re(()=>ve(s,`${e.refTagsLength?"h-3/5":"h-4/5"} text-neutral-300 mx-auto overflow-auto tracking-tight break-words rounded`)),s}}),t(p,{get when(){return f(()=>$()!=null)()&&!$()},get children(){return[t(p,{get when(){return e.event.isRepost},get children(){const s=a(jt),l=s.firstChild,i=l.firstChild,b=i.firstChild,o=b.nextSibling,u=l.nextSibling,g=u.firstChild;return o.$$click=r,n(o,()=>e.reposter()?.name??"npub"),n(g,()=>e.event.content),k(),s}}),t(p,{get when(){return!e.event.isRepost},get children(){const s=a(Nt),l=s.firstChild;return n(l,()=>e.event.content),s}})]}})]};q(["click"]);const Ht=c('<div class="group w-1/6 transition">'),Kt=c('<div class="group cursor-pointer transition">'),Qe=e=>{const{relay:r,anchorsMode:s}=K(le),l=async()=>{const i={content:e.enrichedEvent.content,created_at:e.enrichedEvent.created_at,id:e.enrichedEvent.id,kind:e.enrichedEvent.kind,pubkey:e.enrichedEvent.pubkey,sig:e.enrichedEvent.sig,tags:e.enrichedEvent.tags};(await r.repostEvent(i,s.get())).error?console.log("could not repost post"):console.log("repost: success")};return[t(p,{get when(){return f(()=>$()!=null)()&&$()},get children(){const i=a(Ht);return i.$$click=l,n(i,t(Ie,{class:"text-slate-400 mx-auto group-active:text-slate-200",size:26})),k(),i}}),t(p,{get when(){return f(()=>$()!=null)()&&!$()},get children(){const i=a(Kt);return i.$$click=l,n(i,t(Ie,{class:"text-slate-400 group-hover:text-slate-200",size:26})),k(),i}})]};q(["click"]);const Bt=c('<div class="text-slate-400"><div class="cursor-pointer hover:scale-105 hover:text-slate-200 active:scale-90"></div><div class="cursor-pointer hover:scale-105 hover:text-slate-200 active:scale-90">'),Vt=e=>e.scrollPage==null?[]:(()=>{const r=a(Bt),s=r.firstChild,l=s.nextSibling;return s.$$click=()=>e.scrollPage("up"),n(s,t(mt,{size:40})),l.$$click=()=>e.scrollPage("down"),n(l,t(vt,{size:40})),k(),r})();q(["click"]);const Ot=c('<div class="border-t border-slate-400 border-opacity-50 pt-2 px-5"><div class="flex justify-center items-stretch"><textarea class="block placeholder:text-base text-base focus:outline-none bg-slate-500 bg-opacity-10 focus:bg-opacity-25 mx-auto text-slate-300 caret-orange-200 resize-none px-5 py-2 rounded-md w-4/5" rows="2" placeholder="write your reply"></textarea><div class="relative text-orange-300 mx-auto group rounded-md w-1/6"><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div></div></div><div class="flex items-center justify-between gap-x-2 py-1 mt-2"><div class="text-sm text-neutral-300 bg-slate-700 rounded px-2 py-1 text-left">Replying to: <span class="underline underline-offset-4 ml-5"></span></div><!#><!/>'),Gt=c('<div class="mr-4 border-t border-slate-400 border-opacity-50 pt-2"><div class="flex justify-center items-stretch"><div class="w-4/5"><textarea class="block placeholder:text-lg text-lg focus:outline-none bg-slate-500 bg-opacity-10 hover:bg-opacity-20 focus:bg-opacity-25 mx-auto text-slate-300 caret-orange-200 resize-none xl:custom-scrollbar px-5 py-2 rounded-md w-full" rows="2" placeholder="write your reply"></textarea><div class="flex items-center justify-between py-1 mt-2"><div class="text-sm text-neutral-300 bg-slate-700 rounded px-2 py-1">Replying to: <span class="underline underline-offset-4 ml-5"></span></div><!#><!/></div></div><div class="relative text-orange-300 mx-auto group cursor-pointer hover:bg-neutral-600 rounded-md w-1/6"><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">'),Wt=c('<div class="text-sm text-right text-neutral-300 bg-slate-700 rounded px-2 py-1"><p class="active:scale-95">reply to main post instead'),qt=c('<div class="text-sm text-neutral-300 bg-slate-700 rounded px-2 py-1 cursor-pointer hover:text-white"><p class="active:scale-95">reply to main post instead'),Je=e=>{const{relay:r}=K(le),s=K($e),[l,i]=L(""),b=()=>e.replyEvent()==null?"main post":e.replyEvent().content.length>30?`"${e.replyEvent().content.substring(0,30)}..."`:e.replyEvent().content,o=()=>{e.setReplyEvent()},u=x=>{const h=x.currentTarget.value;i(h)},g=()=>r.userPubKey?e.replyEvent()==null&&s.rootEvent.pubkey==r.userPubKey?(console.log("Cannot directly reply to your own post"),!1):l().trim().length==0?(console.log("Cannot post an empty reply"),!1):!0:(console.log("No pubkey, nostr extension missing"),!1),v=async()=>{if(!g())return;(await r.replyToEvent(l(),e.replyEvent()??s.rootEvent,s.rootEvent)).error?console.log("Event reply did not go through, try again"):(await s.fetchAndSetCommentsStructure(!1),i(""),e.setReplyEvent())};return[t(p,{get when(){return f(()=>$()!==void 0)()&&$()},get children(){const x=a(Ot),h=x.firstChild,m=h.firstChild,S=m.nextSibling,R=S.firstChild,_=h.nextSibling,E=_.firstChild,T=E.firstChild,U=T.nextSibling,F=E.nextSibling,[P,D]=d(F.nextSibling);return m.$$input=u,S.$$click=v,n(R,t(ze,{size:40,class:"w-fit mx-auto group-hover:scale-110 group-active:scale-90 transition"})),n(U,b),n(_,(()=>{const I=f(()=>e.replyEvent()!=null);return()=>I()?(()=>{const C=a(Wt);return C.$$click=o,k(),C})():[]})(),P,D),re(()=>m.value=l()),k(),x}}),t(p,{get when(){return f(()=>$()!==void 0)()&&!$()},get children(){const x=a(Gt),h=x.firstChild,m=h.firstChild,S=m.firstChild,R=S.nextSibling,_=R.firstChild,E=_.firstChild,T=E.nextSibling,U=_.nextSibling,[F,P]=d(U.nextSibling),D=m.nextSibling,I=D.firstChild;return S.$$input=u,n(T,b),n(R,(()=>{const C=f(()=>e.replyEvent()!=null);return()=>C()?(()=>{const z=a(qt);return z.$$click=o,k(),z})():[]})(),F,P),D.$$click=v,n(I,t(ze,{size:40,class:"w-fit mx-auto group-hover:scale-110 group-active:scale-90 transition"})),re(()=>S.value=l()),k(),x}})]};q(["input","click"]);const Qt=c('<div class="ml-14">'),Jt=c('<div class="my-3"><div><div class="text-sm text-left mb-1 w-fit rounded-md px-2 py-1 bg-slate-600"><!#><!/><span> replied on <!#><!/></span></div><p></p><div class="flex justify-between items-center"><!#><!/><!#><!/></div></div><!#><!/>'),Xt=c('<div class="text-sm rounded text-red-100 bg-red-800 bg-opacity-30 px-2 py-1 hover:bg-opacity-60 cursor-pointer active:scale-95 select-none">delete comment'),Yt=c('<div class="flex justify-end items-center gap-x-3 px-2 py-1 mt-1 rounded-md w-fit ml-auto bg-slate-600"><div class="flex items-center hover:bg-slate-700 cursor-pointer rounded-md"><span class="text-sm ml-1"></span><!#><!/></div><div class="flex items-center hover:bg-slate-700 cursor-pointer rounded-md active:bg-opacity-50"><span class="text-sm ml-1"></span><!#><!/></div><div class="hover:bg-slate-700 cursor-pointer rounded-md active:bg-opacity-50 px-2 py-1">'),Zt=c('<div class="flex justify-end items-center gap-x-3 px-2 py-1 mt-1 rounded-md w-fit ml-auto bg-slate-600"><div class="flex items-center rounded-md"><span class="text-sm ml-1"></span><!#><!/></div><div class="flex items-center rounded-md"><span class="text-sm ml-1"></span><!#><!/></div><div class=" rounded-md px-2 py-1">'),Ce=e=>{const{relay:r,authMode:s}=K(le),l=K($e),i=()=>{e.setReplyEvent(e.commentTree.event.data)},[b,o]=L(!1),u=()=>{h()&&o(!b())},[g,v]=L({positive:e.commentTree.event.data.positive,negative:e.commentTree.event.data.negative}),x=async _=>{await at(e.commentTree.event.data,g,v,_,r)},h=()=>e.commentTree.event.comments.length!=0,m=()=>{let _=`text-base text-neutral-200 break-words rounded-md text-left mx-auto
                       bg-neutral-400 bg-opacity-25 p-3 pb-3 border border-transparent transition`;return h()&&(_+=" cursor-pointer hover:border-neutral-700 hover:bg-neutral-600 active:bg-opacity-40"),e.replyEvent()!=null&&e.replyEvent()?.id==e.commentTree.event.data.id&&(_+=" border border-neutral-100"),_},S=()=>s.get()!="private"?!1:e.commentTree.event.data.pubkey==r.userPubKey,R=async()=>{await r.deleteEvent(e.commentTree.event.data.id),await l.fetchAndSetCommentsStructure(!0)};return(()=>{const _=a(Jt),E=_.firstChild,T=E.firstChild,U=T.firstChild,[F,P]=d(U.nextSibling),D=F.nextSibling,I=D.firstChild,C=I.nextSibling,[z,A]=d(C.nextSibling),W=T.nextSibling,y=W.nextSibling,w=y.firstChild,[B,te]=d(w.nextSibling),Q=B.nextSibling,[V,J]=d(Q.nextSibling),de=E.nextSibling,[H,ge]=d(de.nextSibling);return n(T,t(ue,{get href(){return`/users/${e.commentTree.event.data.pubkey}`},class:"font-bold hover:underline hover:underline-offset-2",get children(){return e.commentTree.event.data.name==""?"nostr user":e.commentTree.event.data.name}}),F,P),n(D,()=>_e(e.commentTree.event.data.created_at),z,A),W.$$click=u,n(W,()=>e.commentTree.event.data.content),n(y,(()=>{const O=f(()=>!!S());return()=>O()?(()=>{const M=a(Xt);return M.$$click=R,k(),M})():[]})(),B,te),n(y,(()=>{const O=f(()=>s.get()=="private");return()=>O()?(()=>{const M=a(Yt),j=M.firstChild,X=j.firstChild,ne=X.nextSibling,[se,Y]=d(ne.nextSibling),N=j.nextSibling,G=N.firstChild,ie=G.nextSibling,[ae,Z]=d(ie.nextSibling),ee=N.nextSibling;return j.$$click=()=>x("+"),n(X,()=>g().positive.count),n(j,t(Le,{size:26}),se,Y),N.$$click=()=>x("-"),n(G,()=>g().negative.count),n(N,t(Ue,{size:26}),ae,Z),ee.$$click=i,n(ee,t(Fe,{})),k(),M})():(()=>{const M=a(Zt),j=M.firstChild,X=j.firstChild,ne=X.nextSibling,[se,Y]=d(ne.nextSibling),N=j.nextSibling,G=N.firstChild,ie=G.nextSibling,[ae,Z]=d(ie.nextSibling),ee=N.nextSibling;return n(X,()=>g().positive.count),n(j,t(Le,{size:26}),se,Y),n(G,()=>g().negative.count),n(N,t(Ue,{size:26}),ae,Z),ee.$$click=i,n(ee,t(Fe,{})),k(),M})()})(),V,J),n(_,t(p,{get when(){return b()},get children(){const O=a(Qt);return n(O,t(oe,{get each(){return e.commentTree.event.comments},children:M=>t(Ce,{get replyEvent(){return e.replyEvent},get setReplyEvent(){return e.setReplyEvent},commentTree:M})})),O}}),H,ge),re(()=>ve(W,m())),k(),_})()};q(["click"]);const en=c('<div class="h-screen w-screen bg-slate-800 bg-opacity-95"><div class="rounded h-[95%] mx-auto flex flex-col justify-between"><div></div><!#><!/>'),tn=c('<div class="h-full w-full mx-auto"><div class="rounded h-[95%] flex flex-col justify-between"><div></div><!#><!/>'),Xe=c('<div class="my-7">'),Ye=c('<div class="h-1/5">'),Ze=e=>{const{authMode:r}=K(le),s=K($e),[l,i]=L();return[t(p,{get when(){return f(()=>$()!==void 0)()&&$()},get children(){const b=a(en),o=b.firstChild,u=o.firstChild,g=u.nextSibling,[v,x]=d(g.nextSibling);return n(u,t(p,{get when(){return!s.isCommentTreeLoading()},get fallback(){return t(De,{size:100,color:"white",class:"animate-spin mx-auto w-fit py-3 mt-20"})},get children(){return t(oe,{get each(){return e.commentsStructure.event.comments},children:h=>(()=>{const m=a(Xe);return n(m,t(Ce,{commentTree:h,replyEvent:l,setReplyEvent:i})),m})()})}})),n(o,(()=>{const h=f(()=>r.get()=="private");return()=>h()?(()=>{const m=a(Ye);return n(m,t(Je,{replyEvent:l,setReplyEvent:i})),m})():[]})(),v,x),re(()=>ve(u,`overflow-y-scroll px-5 ${r.get()=="private"?"h-4/5":"h-full"}`)),b}}),t(p,{get when(){return f(()=>$()!==void 0)()&&!$()},get children(){const b=a(tn),o=b.firstChild,u=o.firstChild,g=u.nextSibling,[v,x]=d(g.nextSibling);return n(u,t(p,{get when(){return!s.isCommentTreeLoading()},get fallback(){return t(De,{size:100,color:"white",class:"animate-spin mx-auto w-fit py-3 mt-20"})},get children(){return t(oe,{get each(){return e.commentsStructure.event.comments},children:h=>(()=>{const m=a(Xe);return n(m,t(Ce,{commentTree:h,replyEvent:l,setReplyEvent:i})),m})()})}})),n(o,(()=>{const h=f(()=>r.get()=="private");return()=>h()?(()=>{const m=a(Ye);return n(m,t(Je,{replyEvent:l,setReplyEvent:i})),m})():[]})(),v,x),re(()=>ve(u,`overflow-y-scroll xl:custom-scrollbar pr-2 ${r.get()=="private"?"h-4/5":"h-full"}`)),b}})]},nn=c('<div class="relative rounded hover:bg-slate-600 active:bg-slate-700 px-2"><!#><!/><div class="text-sm text-center text-slate-400 tracking-tighter mt-1">'),rn=c('<div class="relative rounded py-5 hover:bg-slate-600 cursor-pointer active:bg-slate-700 w-1/12"><!#><!/><div class="absolute top-1 right-4 text-sm text-slate-400 tracking-tighter">'),et=c('<div class="relative rounded py-5 w-1/12 animate-pulse">'),tt=e=>[t(p,{get when(){return f(()=>$()!=null)()&&$()},get children(){return t(p,{get when(){return!e.isLoading()},get fallback(){return(()=>{const r=a(et);return n(r,t(fe,{class:"text-slate-500 mx-auto",size:28})),r})()},get children(){const r=a(nn),s=r.firstChild,[l,i]=d(s.nextSibling),b=l.nextSibling;return Ae(r,"click",e.openCommentsPopup,!0),n(r,t(fe,{class:"text-slate-400 mx-auto",size:22}),l,i),n(b,()=>e.commentsCount()),k(),r}})}}),t(p,{get when(){return f(()=>$()!=null)()&&!$()},get children(){return t(p,{get when(){return!e.isLoading()},get fallback(){return(()=>{const r=a(et);return n(r,t(fe,{class:"text-slate-500 mx-auto",size:28})),r})()},get children(){const r=a(rn),s=r.firstChild,[l,i]=d(s.nextSibling),b=l.nextSibling;return Ae(r,"click",e.openCommentsPopup,!0),n(r,t(fe,{class:"text-slate-400 mx-auto",size:28}),l,i),n(b,()=>e.commentsCount()),k(),r}})}})];q(["click"]);const ln=c('<img loading="lazy" class="rounded mx-auto w-2/5">'),sn=c('<div class="w-[90vw] h-full bg-slate-600 mr-2 rounded animate-pulse">'),an=c('<div class="mb-5 h-1/4 border border-slate-400 border-opacity-25 rounded animate-pulse"><div class="py-5 border-b border-slate-400 border-opacity-25 bg-slate-700 rounded-t"></div><div class="py-10 border-b border-slate-400 border-opacity-25"></div><div class="py-5">'),on=c('<span class="hidden group-hover:block absolute text-xs -top-12 left-1/2 -translate-x-1/2 bg-slate-600 rounded-md px-5 py-2 w-48 text-center shadow-md">'),cn=c('<div class="flex items-center justify-between py-3"><div class="w-1/4"></div><!#><!/><!#><!/><!#><!/>'),un=c('<div class="flex flex-col justify-between w-[90vw] h-full mr-2 rounded bg-slate-700 bg-opacity-50"><div class="text-center w-5/6 mx-auto break-all text-sm py-4"></div><!#><!/>'),dn=c('<div class="text-slate-300 bg-slate-700 break-words mb-5 py-1 relative border-x border-orange-200 border-opacity-40"><div class="my-3"></div><div class="text-center text-base text-slate-300 py-3 px-5"></div><!#><!/>'),nt=e=>{const r=o=>o!=""?(()=>{const u=a(ln);return re(()=>xt(u,"src",e.tag.preview)),u})():[],s=a(sn),l=a(an),i=o=>$()?[]:(()=>{const u=a(on);return n(u,o),u})(),b=(()=>{const o=a(cn),u=o.firstChild,g=u.nextSibling,[v,x]=d(g.nextSibling),h=v.nextSibling,[m,S]=d(h.nextSibling),R=m.nextSibling,[_,E]=d(R.nextSibling);return n(u,t(yt,{get category(){return e.tag.category}})),n(o,t(Se,{class:"w-1/4 cursor-pointer group relative",get href(){return e.tag.url},target:"_blank",get children(){return[t($t,{size:28,class:"mx-auto text-slate-400 hover:scale-110 active:scale-95 transition"}),f(()=>i("navigate to external resource link"))]}}),v,x),n(o,t(Se,{get href(){return`/refs/${encodeURIComponent(e.tag.url)}`},class:"w-1/4 group relative",get children(){return[t(ht,{size:28,class:"mx-auto cursor-pointer text-slate-400 hover:scale-110 active:scale-95 transition"}),f(()=>i("explore other posts using the same reference"))]}}),m,S),n(o,t(Se,{get href(){return`/write?preview=${encodeURIComponent(e.tag.preview)}&url=${encodeURIComponent(e.tag.url)}&primaryInfo=${encodeURIComponent(e.tag.primaryInfo)}&category=${e.tag.category}`},class:"w-1/4 data-[title]:hover:text-slate-300 group relative",get children(){return[t(ft,{size:28,"stroke-width":1.5,class:"mx-auto cursor-pointer text-slate-400 hover:scale-110 active:scale-95 transition"}),f(()=>i("write a post with the same reference"))]}}),_,E),o})();return $()?t(p,{get when(){return!e.isLoading()},fallback:s,get children(){const o=a(un),u=o.firstChild,g=u.nextSibling,[v,x]=d(g.nextSibling);return n(u,(()=>{const h=f(()=>e.tag.primaryInfo=="");return()=>h()?ce(e.tag.url,40):ce(e.tag.primaryInfo,40)})()),n(o,b,v,x),o}}):t(p,{get when(){return!e.isLoading()},fallback:l,get children(){const o=a(dn),u=o.firstChild,g=u.nextSibling,v=g.nextSibling,[x,h]=d(v.nextSibling);return n(u,()=>r(e.tag.preview)),n(g,()=>e.tag.primaryInfo==""?e.tag.url:e.tag.primaryInfo),n(o,b,x,h),o}})},gn=c('<div class="col-span-1 xl:col-span-2 h-full overflow-auto no-scrollbar rounded-md bg-neutral-900 bg-opacity-40"><div class="text-center text-base text-slate-200 bg-slate-700 w-fit px-10 mx-auto my-5 py-2 rounded-md"></div><div class="h-[90%] overflow-auto no-scrollbar py-5 px-2 xl:px-12 mx-auto">'),rt=e=>[t(p,{get when(){return f(()=>$()!==void 0)()&&$()},get children(){return t(oe,{get each(){return e.eventRefTags()},children:r=>t(Me.div,{animate:{opacity:[.2,1],scale:[.5,1]},class:"snap-center py-2",get children(){return t(nt,{tag:r,get isLoading(){return e.isLoading}})}})})}}),t(p,{get when(){return f(()=>$()!==void 0)()&&!$()},get children(){return[[],(()=>{const r=a(gn),s=r.firstChild,l=s.nextSibling;return n(s,(()=>{const i=f(()=>e.eventRefTags().length==1);return()=>i()?"1 reference":`${e.eventRefTags().length} references`})()),n(l,t(oe,{get each(){return e.eventRefTags()},children:i=>t(Me.div,{animate:{opacity:[.2,1],scale:[.5,1]},get children(){return t(nt,{tag:i,get isLoading(){return e.isLoading}})}})})),r})()]}})],mn=c("<div>"),vn=c('<div class="group cursor-pointer transition">'),lt=e=>{const{relay:r,favoriteEventIDs:s}=K(le),[l,i]=L(!1),[b,o]=L(!1);ke(()=>{i(s.get().includes(e.eventID))});const u=async()=>{if(!b()){if(o(!0),l()){const g=await r.removeEventFromFavorites(e.eventID);g.error||(i(!1),s.set(g.data))}else{const g=await r.addEventToFavorites(e.eventID);g.error||(i(!0),s.set(g.data))}o(!1)}};return[t(p,{get when(){return f(()=>$()!=null)()&&$()},get children(){const g=a(mn);return g.$$click=u,n(g,(()=>{const v=f(()=>!!l());return()=>v()?t(je,{get class(){return`${b()?"animate-pulse":""} text-slate-400 mx-auto`},"stroke-width":1,size:28}):t(Ne,{get class(){return`${b()?"animate-pulse":""} text-slate-400 mx-auto`},"stroke-width":1,size:28})})()),k(),g}}),t(p,{get when(){return f(()=>$()!=null)()&&!$()},get children(){const g=a(vn);return g.$$click=u,n(g,(()=>{const v=f(()=>!!l());return()=>v()?t(je,{get class(){return`${b()?"animate-pulse cursor-wait":""} text-slate-400 mx-auto group-hover:scale-105`},"stroke-width":1,size:28}):t(Ne,{get class(){return`${b()?"animate-pulse cursor-wait":""} text-slate-400 mx-auto group-hover:scale-105`},"stroke-width":1,size:28})})()),k(),g}})]};q(["click"]);const $n=e=>e.includes("youtube")||e.includes("youtu.be")?"video":e.includes("spotify")?"song":e.includes("themoviedb")?"movie":e.includes("openlibrary")?"book":"generic";class hn{rootEvent;incomingComments;structure;constructor(r,s){this.rootEvent=r,this.incomingComments=s.sort(bt).map(l=>this.normalizePositionalTags(this.discardIntermediateTags(l))),this.structure={event:{data:this.rootEvent,comments:[]}},this.assignComments(this.structure)}isPositionalComment(r){const s=r.tags.filter(i=>i[0]=="e");let l=!0;for(let i=0;i<s.length;i++)if(s[i].length!==2){l=!1;break}return l}discardIntermediateTags(r){const s=r.tags.filter(l=>l[0]=="e");if(s.length>2)if(this.isPositionalComment(r)){const l=s.length==1?[s[0]]:[s[0],s[s.length-1]];r.tags=[...r.tags.filter(i=>i[0]!="e"),...l]}else{const l=r.tags.filter(i=>i[0]=="e"&&i[3]!="mention");r.tags=[...r.tags.filter(i=>i[0]!="e"),...l]}return r}normalizePositionalTags(r){const s=r.tags.filter(l=>l[0]=="e");return r.tags=[...r.tags.filter(l=>l[0]!="e"),...s.map(l=>l[1]==this.rootEvent.id?["e",l[1],"","root"]:["e",l[1],"","reply"])],r}selectRootComments(){return this.incomingComments.filter(r=>r.tags.filter(s=>s[0]=="e").length==1)}selectReplyComments(r){return this.incomingComments.filter(s=>this.replyTagEventID(s)==r)}replyTagEventID(r){const s=r.tags.find(l=>l[0]=="e"&&l[3]=="reply");if(s)return s[1]}selectNextComments(r){let s=[];return r==this.rootEvent.id?s=this.selectRootComments():s=this.selectReplyComments(r),s&&s.forEach(l=>{const i=this.incomingComments.findIndex(b=>b.id==l.id);this.incomingComments.splice(i,1)}),s}assignComments(r){this.selectNextComments(r.event.data.id).forEach(s=>{r.event.comments.push({event:{data:s,comments:[]}}),r.event.comments.forEach(l=>this.assignComments(l))})}}const fn=c('<div class="snap-start h-[90dvh] text-white pt-2 mx-auto px-2"><!#><!/><div></div><div class="h-[10%] flex items-center justify-around"><div></div><!#><!/><!#><!/><!#><!/></div><div class="h-[10%] flex items-center justify-around gap-x-3"><div class="text-sm text-slate-400 w-1/3 text-center"><p></p><p></p></div><!#><!/><!#><!/>'),xn=c('<div class="h-[10dvh]">'),st=c('<div class="absolute top-0 left-0 z-10">'),bn=c('<div class="snap-start h-full text-white text-lg mx-auto rounded-md px-3 py-1 gap-y-3"><div class="grid grid-cols-6 h-[84%] mb-2 gap-x-2"><!#><!/><!#><!/></div><div class="w-full grow mx-auto flex justify-around items-center rounded-md px-5 h-[15%] bg-neutral-700 bg-opacity-25"><!#><!/><div class="w-1/4 p-2 rounded hover:bg-slate-600 cursor-pointer active:bg-slate-700"><!#><!/><div class="text-sm text-slate-400 mt-3 text-center"></div></div><!#><!/><!#><!/><!#><!/><!#><!/><!#><!/>'),it=c('<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 xl:w-2/3 z-10">'),$e=pt(),wn=e=>{const r=K(_t),{relay:s,authMode:l}=K(le),[i,b]=L(!0),[o,u]=L([]),[g,v]=L(!1),[x,h]=L(),[m,S]=L(0),[R,_]=L(!1),[E,T]=L(!1),[U,F]=L(),[P,D]=L({about:e.event.about,name:e.event.name,picture:e.event.picture,pubkey:e.event.pubkey}),I=y=>{e.addHtmlRef!==void 0&&e.addHtmlRef(y,e.event.id,e.event.created_at)},C=()=>{r.toggleMenuButton(),v(!0)},z=()=>{r.toggleMenuButton(),_(!0)},A=async y=>{T(!0),y&&await new Promise(B=>setTimeout(B,500));const w=await s.fetchComments(e.event.id);S(w.length),h(new hn(e.event,w).structure),T(!1)},W=()=>{P().pubkey!=e.event.pubkey&&D({about:e.event.about,name:e.event.name,picture:e.event.picture,pubkey:e.event.pubkey})};return ke(async()=>{e.event.isRepost&&F(await s.fetchUserMetadata(e.event.repostEvent?.pubkey));const y=e.event.tags.filter(w=>w[0]=="r").filter(w=>w[1]!=s.ANCHORS_EVENT_RTAG_IDENTIFIER);for(const w of y)switch($n(w[1])){case"movie":const B=w[1].split("/")[w[1].split("/").length-1];u([...o(),await Ct(B,w[1])]);break;case"book":const te=w[1].split("/")[w[1].split("/").length-1];u([...o(),await St(te,w[1])]);break;case"song":const Q=w[1].split("/")[w[1].split("/").length-1];u([...o(),await wt(Q,w[1])]);break;case"video":const V={preview:"",primaryInfo:"",secondaryInfo:"",url:w[1],category:"video"};u([...o(),V]);break;case"generic":const J={preview:"",primaryInfo:"",secondaryInfo:"",url:w[1],category:"generic"};u([...o(),J]);break}await A(!1),b(!1)}),[t(p,{get when(){return f(()=>$()!==void 0)()&&$()},get children(){return[(()=>{const y=a(fn),w=y.firstChild,[B,te]=d(w.nextSibling),Q=B.nextSibling,V=Q.nextSibling,J=V.firstChild,de=J.nextSibling,[H,ge]=d(de.nextSibling),O=H.nextSibling,[M,j]=d(O.nextSibling),X=M.nextSibling,[ne,se]=d(X.nextSibling),Y=V.nextSibling,N=Y.firstChild,G=N.firstChild,ie=G.nextSibling,ae=N.nextSibling,[Z,ee]=d(ae.nextSibling),pe=Z.nextSibling,[he,ye]=d(pe.nextSibling);return He(I,y),n(y,t(qe,{setShowUserPopup:v,setUserPopupProps:D,get event(){return e.event},get refTagsLength(){return o().length},reposter:U}),B,te),n(Q,t(rt,{eventRefTags:o,isLoading:i})),J.$$click=C,n(J,t(be,{get name(){return ce(e.event.name,15)},get about(){return e.event.about},get picture(){return e.event.picture},get pubKey(){return e.event.pubkey},layout:"h"})),n(V,t(Ve,{get event(){return e.event}}),H,ge),n(V,t(tt,{commentsCount:m,isLoading:i,openCommentsPopup:z}),M,j),n(V,(()=>{const me=f(()=>l.get()=="private");return()=>me()?t(lt,{get eventID(){return e.event.id}}):[]})(),ne,se),n(G,()=>new Date(e.event.created_at).toTimeString().split(" ")[0]),n(ie,()=>new Date(e.event.created_at).toDateString()),n(Y,t(We,{get nostrEventID(){return e.event.id}}),Z,ee),n(Y,(()=>{const me=f(()=>l.get()=="private");return()=>me()?t(Qe,{get enrichedEvent(){return e.event}}):[]})(),he,ye),re(()=>ve(Q,`${o().length?"h-1/5":"hidden"} flex snap-x snap-mandatory overflow-x-scroll`)),k(),y})(),a(xn),(()=>{const y=a(st);return n(y,t(xe,{autoClose:!1,show:g,setShow:v,largeHeight:!0,get children(){return t(Ge,{get about(){return P().about},get picture(){return P().picture},get pubkey(){return P().pubkey},get name(){return P().name}})}})),y})(),(()=>{const y=a(st);return n(y,t(xe,{autoClose:!1,show:R,setShow:_,largeHeight:!0,get children(){return t($e.Provider,{get value(){return{rootEvent:e.event,fetchAndSetCommentsStructure:A,isCommentTreeLoading:E}},get children(){return t(Ze,{get commentsStructure(){return x()}})}})}})),y})()]}}),t(p,{get when(){return f(()=>$()!==void 0)()&&!$()},get children(){return[(()=>{const y=a(bn),w=y.firstChild,B=w.firstChild,[te,Q]=d(B.nextSibling),V=te.nextSibling,[J,de]=d(V.nextSibling),H=w.nextSibling,ge=H.firstChild,[O,M]=d(ge.nextSibling),j=O.nextSibling,X=j.firstChild,[ne,se]=d(X.nextSibling),Y=ne.nextSibling,N=j.nextSibling,[G,ie]=d(N.nextSibling),ae=G.nextSibling,[Z,ee]=d(ae.nextSibling),pe=Z.nextSibling,[he,ye]=d(pe.nextSibling),me=he.nextSibling,[Ee,ot]=d(me.nextSibling),ct=Ee.nextSibling,[ut,dt]=d(ct.nextSibling);return He(I,y),n(w,t(qe,{setShowUserPopup:v,setUserPopupProps:D,get event(){return e.event},reposter:U,get refTagsLength(){return o().length}}),te,Q),n(w,t(rt,{eventRefTags:o,isLoading:i}),J,de),n(H,t(Vt,{get scrollPage(){return e.scrollPage}}),O,M),j.$$click=C,n(j,t(be,{get name(){return ce(e.event.name,10)},get about(){return e.event.about},get picture(){return e.event.picture},get pubKey(){return e.event.pubkey},layout:"h"}),ne,se),n(Y,()=>_e(e.event.created_at)),n(H,t(Ve,{get event(){return e.event}}),G,ie),n(H,t(tt,{commentsCount:m,isLoading:i,openCommentsPopup:z}),Z,ee),n(H,(()=>{const we=f(()=>l.get()=="private");return()=>we()?t(lt,{get eventID(){return e.event.id}}):[]})(),he,ye),n(H,(()=>{const we=f(()=>l.get()=="private");return()=>we()?t(Qe,{get enrichedEvent(){return e.event}}):[]})(),Ee,ot),n(H,t(We,{get nostrEventID(){return e.event.id}}),ut,dt),k(),y})(),(()=>{const y=a(it);return n(y,t(xe,{autoClose:!1,show:g,setShow:v,onCloseFunc:W,largeHeight:!0,get children(){return t(Ge,{get about(){return P().about},get picture(){return P().picture},get pubkey(){return P().pubkey},get name(){return P().name}})}})),y})(),(()=>{const y=a(it);return n(y,t(xe,{autoClose:!1,show:R,setShow:_,largeHeight:!0,get children(){return t($e.Provider,{get value(){return{rootEvent:e.event,fetchAndSetCommentsStructure:A,isCommentTreeLoading:E}},get children(){return t(Ze,{get commentsStructure(){return x()}})}})}})),y})()]}})]};q(["click"]);export{wn as E};
