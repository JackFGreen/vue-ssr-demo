!function(t){function e(e){for(var n,a,c=e[0],u=e[1],i=e[2],l=0,f=[];l<c.length;l++)a=c[l],o[a]&&f.push(o[a][0]),o[a]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(t[n]=u[n]);for(p&&p(e);f.length;)f.shift()();return s.push.apply(s,i||[]),r()}function r(){for(var t,e=0;e<s.length;e++){for(var r=s[e],n=!0,c=1;c<r.length;c++){var u=r[c];0!==o[u]&&(n=!1)}n&&(s.splice(e--,1),t=a(a.s=r[0]))}return t}var n={},o={0:0},s=[];function a(e){if(n[e])return n[e].exports;var r=n[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=t,a.c=n,a.d=function(t,e,r){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)a.d(r,n,function(e){return t[e]}.bind(null,n));return r},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/dist/";var c=window.webpackJsonp=window.webpackJsonp||[],u=c.push.bind(c);c.push=e,c=c.slice();for(var i=0;i<c.length;i++)e(c[i]);var p=u;s.push([12,1]),r()}([,,,,,,,,,,,,function(t,e,r){const{createApp:n}=r(13),{app:o,router:s,store:a}=n();console.log("entry-client"),window.__INITIAL_STATE__&&a.replaceState(window.__INITIAL_STATE__),s.onReady(()=>{console.log("router.onReady"),s.beforeResolve(async(t,e,r)=>{const n=s.getMatchedComponents(t),o=s.getMatchedComponents(e);let c=!1;const u=n.filter((t,e)=>c||(c=o[e]!==t));if(!u.length)return r();try{await Promise.all(u.map((e={})=>{const r=e.asyncData;if(r)return r({store:a,route:t})})),r()}catch(t){r(t)}}),o.$mount("#app")})},function(t,e,r){const n=r(2),{createRouter:o}=r(16),{createStore:s}=r(19),{sync:a}=r(39);e.createApp=(t={})=>{const e=o(),r=s();return a(r,e),{app:new n({router:e,store:r,data:()=>({url:t.url||e.currentRoute.path}),render(t){const e=t("router-view");return t("div",{attrs:{id:"app"}},[`访问的 URL 是： ${this.url}`,e])}}),router:e,store:r}}},,,function(t,e,r){const n=r(2),o=r(17),s=r(18);n.use(o),e.createRouter=()=>new o({mode:"history",routes:[{path:"/"},{path:"/foo",component:s}]})},,function(t,e){t.exports={asyncData:({store:t,route:e})=>t.dispatch("getList"),data:()=>({}),computed:{list(){return this.$store.state.list}},render(t){const e=this.list.map(e=>t("p",e.zh_name));return t("div",{class:"page-foo"},e)}}},function(t,e,r){const n=r(2),o=r(20);n.use(o);const{getList:s}=r(21);e.createStore=()=>new o.Store({state:{list:[]},actions:{async getList({commit:t}){t("setList",(await s()).data)}},mutations:{setList(t,e){const r=e;t.list=r}}})},,function(t,e,r){const n=r(22);e.getList=()=>n.get("http://localhost:3000/public/country.json")}]);