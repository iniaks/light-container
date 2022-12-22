"use strict";(self["webpackChunklight_container"]=self["webpackChunklight_container"]||[]).push([[558,715],{715:function(t,e,i){i.r(e),i.d(e,{default:function(){return l}});var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return t.letter.isWrap?i("div"):i("div",{staticClass:"letter-container",style:{borderBottomColor:t.letter.isHide?t.lindex==t.current?"blue":"#333":""}},[t.letter.isHide?i("span",{staticClass:"letter-context",style:{color:t.letter.context==t.letter.char||""==t.letter.context?"#333":"red"},on:{click:t.active}},[t._v(" "+t._s(t.letter.context?t.letter.context:"")+" ")]):i("span",{staticClass:"letter-context"},[t._v(t._s(t.letter.char))])])},n=[],r={props:["lindex","current","book","letter"],data(){return{toggle:!1,list:[]}},methods:{random(t,e){return Math.floor(Math.random()*(e-t))+t},generate(){this.list=[this.letter.char];const t=this.book.filter((t=>t.isHide)).map((t=>t.char));while(this.list.length<4){const e=this.random(0,t.length),i=t[e];this.list.indexOf(i)<0&&this.list.push(i)}this.shuffle()},shuffle(){const t=[];while(this.list.length>0){let e=Math.floor(Math.random()*this.list.length);t.push(this.list[e]),this.list.splice(e,1)}this.list=Object.assign([],t)},active(){this.list.length<=0&&this.generate(),this.toggle=!0},complete(){this.toggle=!1},choose(t){this.letter.context=this.list[t],this.$emit("choose")}}},a=r,o=i(1),h=(0,o.Z)(a,s,n,!1,null,"06fbac0c",null),l=h.exports},558:function(t,e,i){i.r(e),i.d(e,{default:function(){return b}});var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"reading-container"},[t.chapter_list.length>0?i("div",{staticClass:"reading-chapters"},t._l(t.chapter_list,(function(e,s){return i("div",{key:"chapter-"+s,class:["reading-chapters__item",s==t.chapter_index?"active":""],on:{click:function(e){return t.chap(s)}}},[t._v(" "+t._s(e.title)+" ")])})),0):t._e(),i("div",{staticClass:"reading-main",staticStyle:{flex:"1"}},[t.book_map.length>0?i("div",{staticClass:"reading-context"},[i("h2",[t._v(t._s(t.book_title))]),t.chapter_list.length>0?i("h3",[t._v(t._s(t.chapter_list[t.chapter_index].title))]):t._e(),i("div",{staticClass:"reading-opts"},[i("div",{on:{click:function(e){return t.learn(.1)}}},[t._v("青铜")]),i("div",{on:{click:function(e){return t.learn(.2)}}},[t._v("白银")]),i("div",{on:{click:function(e){return t.learn(.4)}}},[t._v("黄金")]),i("div",{on:{click:function(e){return t.learn(.6)}}},[t._v("白金")]),i("div",{on:{click:function(e){return t.learn(.8)}}},[t._v("钻石")]),i("div",{on:{click:function(e){return t.learn(1)}}},[t._v("大师")]),i("div",{on:{click:t.complete}},[t._v("全显")])]),i("br"),i("div",{staticClass:"reading-paragraph"},t._l(t.book_map,(function(e,s){return i("context-char",{key:"word-"+s,attrs:{lindex:s,letter:e,book:t.book_map,current:t.hides[t.answer.current]}})})),1)]):t._e(),i("div",{staticClass:"reading-bar"},[i("reading-bar",{attrs:{answer:t.answer,book:t.book_map,hides:t.hides},on:{complete:t.check}})],1)])])},n=[],r=i(669),a=i.n(r),o=i(71),h=i(715),l=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("div",{staticClass:"disk-container"},t._l(t.list,(function(e,s){return i("div",{key:"letter-"+s,staticClass:"disk-item"},[i("span",{staticStyle:{"font-size":"10pt",color:"#999"}},[t._v(t._s(t.keyboards[s].replace("Key","")))]),t._v(" "+t._s(e)+" ")])})),0)])},c=[],d={props:["answer","book","hides"],data(){return{reading:!1,list:[],keyboards:["KeyQ","KeyW","KeyE","KeyR"]}},methods:{random(t,e){return Math.floor(Math.random()*(e-t))+t},generate(){const t=this.hides[this.answer.current];this.list=[this.book[t].char];const e=this.book.filter((t=>t.isHide)).map((t=>t.char));while(this.list.length<4){const t=this.random(0,e.length),i=e[t];this.list.indexOf(i)<0&&this.list.push(i)}this.shuffle()},shuffle(){const t=[];while(this.list.length>0){let e=Math.floor(Math.random()*this.list.length);t.push(this.list[e]),this.list.splice(e,1)}this.list=Object.assign([],t)},choose(t){const e=this.hides[this.answer.current];this.book[e].context=this.list[t],this.book[e].context==this.book[e].char&&(this.answer.current<this.hides.length-1?(this.answer.current++,this.generate()):(this.reading=!1,this.list=[],this.$emit("complete")))},start(){this.reading=!0,this.generate()}},mounted(){const t=this;document.body.addEventListener("keydown",(e=>{"Space"!=e.code||t.reading||t.start();const i=t.keyboards.indexOf(e.code);i>=0&&t.reading&&t.choose(i)}))}},u=d,p=i(1),_=(0,p.Z)(u,l,c,!1,null,"0e848a92",null),f=_.exports,m={components:{ContextChar:h["default"],ReadingBar:f},data(){return{book_title:"",book_map:[],startTime:null,chapter_index:0,chapter_list:[],hides:[],answer:{current:0}}},methods:{generate(t){const e=this;this.book_map=[],t.forEach(((t,i)=>{for(let s=0;s<t.length;s++)e.book_map.push({char:t[s],cindex:s,para:i,isChar:/[\u4E00-\u9FA5]/.test(t[s]),isWrap:!1,isHide:!1,context:""});e.book_map.push({char:"",cindex:t.length,para:i,isChar:!1,isWrap:!0,isHide:!1,context:""})}))},init(){const t=this;a().get(`${o.H}/reading/article?urn=${this.$route.query.urn}`).then((e=>{t.book_title=`${e.data.toptitle}·${e.data.title}`,e.data.subcontents.length>0?(t.chapter_list=e.data.subcontents,t.chap(0)):t.generate(e.data.fulltext)})).catch((t=>t))},chap(t){this.chapter_index=t,this.generate(this.chapter_list[this.chapter_index].fulltext),this.complete(),this.reset()},random(t,e){return Math.floor(Math.random()*(e-t))+t},learn(t){this.complete();const e=this,i=this.book_map.length,s=Math.floor(i*t),n=this.book_map.filter((t=>!t.isHide&&t.isChar)).length;if(this.reset(),0!=n)if(n<=s)this.book_map.forEach((t=>{t.isChar&&(t.isHide=!0)})),this.startTime=new Date;else{this.hides=[];while(this.hides.length<s){const t=this.random(0,i);this.book_map[t].isChar&&!this.book_map[t].isHide&&this.hides.indexOf(t)<0&&this.hides.push(t)}this.hides.sort(((t,e)=>t-e)),this.hides.forEach((t=>{e.book_map[t].isHide=!0})),this.startTime=new Date}},toggle(t){this.book_map[t].isHide=!this.book_map[t].isHide},complete(){this.book_map.forEach((t=>{t.isHide=!1})),this.reset()},reset(){this.startTime=null,this.answer.current=0,this.book_map.forEach((t=>{t.context=""}))},check(){const t=this.book_map.filter((t=>t.isHide&&(""==t.context||t.context!=t.char))).length;if(t<=0){const t=new Date;window.alert(`完成！耗时${(t.getTime()-this.startTime.getTime())/1e3}秒！`),this.complete(),this.reset()}}},mounted(){this.init()}},g=m,k=(0,p.Z)(g,s,n,!1,null,"2f5fc207",null),b=k.exports}}]);
//# sourceMappingURL=558.093a4e41.js.map