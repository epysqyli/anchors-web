import{u as A,R as x,T as L,b as e,o as P,d as U,f as V,c as h,U as X,S as b,h as B,j as g}from"./entry-client-aec7b634.js";import{F as D,f as k,a as H}from"./feed-896c596e.js";import"./index-6d4bb87f.js";import"./EventWrapper-662ef2bc.js";import"./index-419528e1.js";import"./open-library-7291d1eb.js";const Y=()=>{const{relay:c,anchorsMode:d}=A(x),i=L();let a,l=[];const[T,f]=e([]),[I,E]=e(!1),[S,v]=e(!1),[O,m]=e([]),[R,p]=e([]),[t,s]=e([]),[o,u]=e([]),[w,y]=e(!1),[_,F]=e(0),C=async()=>await k(c,v,T,f,O,m,R,p,t,s,o,u,d.get,E,{fetchEventsLimit:33,maxEventsCount:75,userID:i.id,specificRelays:l});P(async()=>{l=await c.fetchUserReadFromRelays(i.id),a=await C()}),U(async()=>{d.get(),clearInterval(a),f([]),s([]),u([]),m([]),p([]),E(!1),a=await C()});const N=()=>{const n=t().length+o().length,r=[...t(),...o()].sort(B);n>75?s(r.slice(n-75,n).sort(g)):s([...t(),...o()].sort(g)),u([])},M=async()=>{v(!0);const n=t().length,r=await H(c,{fetchEventsLimit:20,maxEventsCount:75,userID:i.id,specificRelays:l},d.get,t,s);y(r.olderEventsCount==0),r.olderEventsCount&&F(n),v(!1)};return V(()=>{clearInterval(a)}),h(b,{get when(){return!S()},get fallback(){return h(X,{})},get children(){return h(D,{enrichedEvents:t,showPopup:I,setShowPopup:E,mergeEnrichedEvents:N,isFeedOver:w,loadOlderPosts:M,mostRecentOlderEventIndex:_})}})};export{Y as default};
