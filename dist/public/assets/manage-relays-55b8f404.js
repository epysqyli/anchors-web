import{u as A,R as N,b as v,o as O,g as n,i as r,c as u,L as W,F as $,a as _,l as k,Z as B,r as H,n as I,q as K,S as U,k as V,t as o,O as Z}from"./entry-client-70f5ea60.js";import{e as G}from"./index-c5d10f7a.js";const J=o('<h1 class="text-slate-100 text-center text-2xl md:text-4xl font-bold py-5 xl:py-10">Manage relays you connect to'),Q=o('<div class="xl:grid xl:grid-cols-3 gap-x-3 h-full overflow-y-scroll px-5 xl:px-0 xl:custom-scrollbar relative snap-mandatory snap-y xl:snap-none">'),X=o('<div class="mx-auto xl:w-5/6 xl:p-3 h-4/5">'),Y=o('<div class="flex flex-col justify-between col-span-1 bg-slate-700 bg-opacity-50 rounded pb-1 h-full mb-3 xl:mb-0 snap-start"><h2 class="text-center uppercase tracking-tight py-3 text-slate-300 text-lg font-bold bg-slate-600 rounded mb-3"></h2><div class="grow py-5 overflow-y-scroll xl:custom-scrollbar h-[1vh]"></div><!#><!/>'),ee=o('<div class="flex items-center justify-between w-5/6 mx-auto my-1 py-2 px-2 bg-slate-600 hover:bg-slate-400 hover:bg-opacity-25 rounded bg-opacity-25"><div class="text-slate-300"></div><!#><!/>'),te=o('<div class="text-red-400 text-opacity-40 hover:text-red-400 hover:text-opacity-100 cursor-pointer hover:scale-105 active:scale-95">'),ae=o('<form class="flex items-center justify-around py-2 px-1"><input type="text" pattern="^ws.*" class="block w-4/5 py-2 rounded focus:outline-none bg-slate-500 bg-opacity-75 text-center caret-slate-200 text-slate-200"><button class="block h-full text-green-400 text-opacity-50 hover:text-opacity-100 transition-all hover:scale-105 active:scale-95">'),le=()=>{const{relay:p,readRelays:R,authMode:b}=A(N),[a,y]=v({r:[],w:[],rw:[]},{equals:!1}),[E,w]=v(!1);O(async()=>{w(!0),y(await p.fetchAndSetRelays()),w(!1)});const S=t=>{t.currentTarget.setCustomValidity("Enter a valid websocket URL")},L=()=>{const t=[];for(const s in a())switch(s){case"r":t.push(a().r.map(e=>["r",e,"read"]));break;case"w":t.push(a().w.map(e=>["r",e,"write"]));break;case"rw":t.push(a().rw.map(e=>["r",e]));break}return t.flat()},C=async(t,s)=>{switch(t){case"r":a().r=a().r.filter(e=>e!=s);break;case"w":a().w=a().w.filter(e=>e!=s);break;case"rw":a().rw=a().rw.filter(e=>e!=s);break}await h()},M=async t=>{t.preventDefault();const s=t.target[0].name,e=t.target[0].value;if(e.trim()!=""){switch(s){case"r":a().r.push(e);break;case"w":a().w.push(e);break;case"rw":a().rw.push(e);break}await h()}},h=async()=>{const t={content:"",created_at:Math.floor(Date.now()/1e3),kind:Z.RelayList,tags:L()},s=await window.nostr.signEvent(t),e=p.pub(s,p.getAllRelays());return await new Promise(i=>{e.on("ok",async()=>{y(await p.fetchAndSetRelays()),R.set(p.getReadRelays()),i(!0)}),e.on("failed",()=>{i(!1)})})},T={r:"Read From",w:"Write To",rw:"Read & Write"};return[n(J),(()=>{const t=n(X);return r(t,u(U,{get when(){return!E()},get fallback(){return u(W,{})},get children(){const s=n(Q);return r(s,u($,{get each(){return Object.entries(a())},children:e=>(()=>{const i=n(Y),m=i.firstChild,f=m.nextSibling,j=f.nextSibling,[F,D]=_(j.nextSibling);return r(m,()=>T[e[0]]),r(f,u($,{get each(){return e[1]},children:d=>(()=>{const l=n(ee),c=l.firstChild,x=c.nextSibling,[P,q]=_(x.nextSibling);return r(c,d),r(l,(()=>{const z=k(()=>b.get()=="private");return()=>z()?(()=>{const g=n(te);return g.$$click=()=>C(e[0],d),r(g,u(B,{size:30})),H(),g})():[]})(),P,q),l})()})),r(i,(()=>{const d=k(()=>b.get()=="private");return()=>d()?(()=>{const l=n(ae),c=l.firstChild,x=c.nextSibling;return l.addEventListener("submit",M),c.addEventListener("invalid",S),r(x,u(G,{size:42,"stroke-width":1.5,class:"mx-auto"})),I(()=>K(c,"name",e[0])),l})():[]})(),F,D),i})()})),s}})),t})()]};V(["click"]);export{le as default};
