"use strict";(self["webpackChunklight_container"]=self["webpackChunklight_container"]||[]).push([[531],{531:function(t,e,s){s.r(e),s.d(e,{default:function(){return c}});var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return t.letter.isWrap?s("div"):s("div",{staticClass:"letter-container"},[t.letter.isHide?s("span",{staticClass:"letter-context",style:{borderColor:"#333",color:t.letter.context==t.letter.char||""==t.letter.context?"#333":"red"},on:{mousedown:t.active}},[t._v(" "+t._s(t.letter.context?t.letter.context:"?")+" ")]):s("span",{staticClass:"letter-context"},[t._v(t._s(t.letter.char))]),t.toggle&&t.letter.isHide?s("div",{staticClass:"disk-wrapper",on:{mouseup:t.complete}},[s("div",{staticClass:"disk-container"},[s("div",{staticClass:"disk-center"}),t._l(t.list,(function(t,e){return s("div",{key:"char-"+e,staticClass:"disk-item",style:{transform:"rotate("+45*e+"deg) skewX(45deg)"}})})),t._l(t.list,(function(e,i){return s("div",{key:"option-"+i,staticClass:"disk-item__option",style:{transform:"rotate("+(45*i+22.5)+"deg)"}},[s("div",{staticClass:"disk-item__option_text",style:{transform:"rotate("+(-45*i-22.5)+"deg)"}},[t._v(t._s(e))])])})),t._l(t.list,(function(e,i){return s("div",{key:"mask-"+i,staticClass:"disk-item mask",style:{transform:"rotate("+45*i+"deg) skewX(45deg)"},on:{mouseup:function(e){return t.choose(i)}}})}))],2)]):t._e()])},l=[],r={props:["book","letter"],data(){return{toggle:!1,list:[]}},methods:{random(t,e){return Math.floor(Math.random()*(e-t))+t},generate(){this.list=[this.letter.char];const t=this.book.filter((t=>t.isHide)).map((t=>t.char));while(this.list.length<8){const e=this.random(0,t.length),s=t[e];this.list.indexOf(s)<0&&this.list.push(s)}this.shuffle()},shuffle(){const t=[];while(this.list.length>0){let e=Math.floor(Math.random()*this.list.length);t.push(this.list[e]),this.list.splice(e,1)}this.list=Object.assign([],t)},active(){this.list.length<=0&&this.generate(),this.toggle=!0},complete(){this.toggle=!1},choose(t){this.letter.context=this.list[t],this.$emit("choose")}}},o=r,n=s(1),a=(0,n.Z)(o,i,l,!1,null,"6110b700",null),c=a.exports}}]);
//# sourceMappingURL=531.0fca2f1f.js.map