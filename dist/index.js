!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).marmot=t()}(this,(function(){"use strict";function e(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}
/**
	 * [@uking/marmot]{@link https://github.com/An-uking/marmot.git}
	 *
	 * @namespace marmot
	 * @version 1.1.3
	 * @author uking [ptvile@live.com]
	 * @copyright uking 2024
	 * @license MIT
	 */const t=["Template","Slot"],n=/<([A-Z]\w*)/g;const r=(e,t,n,r)=>{let{strings:l,values:o}=e;return Array.isArray(o)&&Array.isArray(l)?l.length!==o.length+1?"":s(l,o,t,n,r):""};function s(e,t,r,c,u){let f="",a=e.slice(0);for(e=[],c=c||{},u=u||{},r=r||{};a.length;){let e=a[0].match(n);if(e)for(let n=0;n<e.length;n++){if(a[0]=a[0].replace(/\n\s+/g,""),!a[0])continue;let g=e[n].replace("<",""),d=a[0].indexOf(e[n]);f+=a[0].substring(0,d),a[0]=a[0].substring(d+e[n].length);let p=-1,{props:h,currentIndex:m,endTagPosition:x,isCloseTag:b}=i(a,t);if(b)p=x+2,"Slot"===g?h.name?(f+=c[h.name]||"",c[h.name]=""):(f+=c.default||"",c.default=""):f+=l(g,h,r,c,u);else{a[m]=a[m].substring(x+1),a.splice(0,m),t.splice(0,m);let e=`</${g}>`,{index:i,offset:d,length:b}=o(e,a),y=a.slice(0,i+1),w=t.slice(0,i);y[i]=y[i].substring(0,d),m=i,p=d+e.length,c[h.slot||"default"]=s(y,w,r,c,u),"Template"!==g&&(f+=l(g,h,r,c,u)),n+=b}a[m]=a[m].substring(p),a.splice(0,m),t.splice(0,m)}else a[0]=a[0].replace(/\n\s+/g,""),f+=a[0],t[0]&&(Array.isArray(t[0])?f+=t[0].join(""):f+=t[0]),a.splice(0,1),t.splice(0,1)}return f}function l(e,t,n,s,l){let o=n[e];if(!o)throw new Error(`Component ${e} not found.`);let i=new o(l);return r(i.render(t),i.components(),s,i.context)}function o(e,t){let r=t.length,s="</Template>"===e,l=[],o=-1,i=0,c=-1;for(let u=0;u<r;u++){let r=t[u];o=r.indexOf(e);let f=o>-1,a=r;if(f&&(c=u,a=r.substring(0,o)),s){let e=a.match(n);e&&(l.push(...e),i=l.length)}if(f)break}return{index:c,offset:o,length:i}}function i(e,t){const n=e.length;let r={},s=-1,l=-1,o=!1;for(let i=0;i<n;i++){let n=e[i].replace(/\n\s+/g,""),a=new RegExp("(/)?>","g").exec(n);if(a){o="/>"===a[0];let e=a.index;n=n.substring(0,e),r=f(n,r),r=c(n,r),s=i,l=a.index;break}{r=f(n,r),r=c(n,r);let e=u(n);e&&!r[e]&&(r[e]=t[i])}}return{props:r,currentIndex:s,endTagPosition:l,isCloseTag:o}}function c(e,t){t=t||{};const n=/([\w-]+)\s*=\s*(['"])(.*?)\2/g;let r;for(;r=n.exec(e);){const[,e,,n]=r;t[e]=n}return t}function u(e){let t=/([\w-]+)\s*=['"]$/g.exec(e);return t?t[1]:null}function f(e,t){t=t||{};const n=/(^|\s)(\w+)(?=\s|$)/g;let r;for(;r=n.exec(e);){const[,,e]=r;t[e]=!0}return t}return e({render:r,Component:class{constructor(e={}){this.context=e||{};let n=this.constructor.name;if(t.includes(n))throw new Error(`Component ${n} is a reserved keyword.`)}components(){}render(e={}){}},html:(e,...t)=>({strings:e,values:t})})}));
