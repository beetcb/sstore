parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"WJHy":[function(require,module,exports) {
const e=require("@cloudbase/manager-node"),{SCF_FUNCTIONNAME:n,SCF_NAMESPACE:t}=process.env;let r,o,s,c;const i={};class a{constructor(){const n=process.env.conf;c=n?JSON.parse(n):{},r=new e({envId:t})}async load(){const{Environment:e,Timeout:t}=await r.functions.getFunctionDetail(n);e.Variables.forEach(e=>{i[e.Key]=e.Value}),this.timeTracker=process.hrtime(),o=t}get(e){return c[e]}set(e,t){return c[e]=t,i.conf=u(c),this.buffer(()=>r.functions.updateFunctionConfig({name:n,envVariables:i})),t}getGlEnv(e){return i[e]}setGlEnv(e,n){return i[e]=u(n),this.buffer(()=>r.functions.updateFunctionConfig({name:funcName,envVariables:i})),n}buffer(e){const n=o-f(this.timeTracker);console.log(`Will update env after ${n} seconds (the prev update had been canceled!)`),s&&clearTimeout(s),s=setTimeout(e,1e3*(n-.1))}}function u(e){if(e)return"string"==typeof e?e:JSON.stringify(e)}function f(e){const n=process.hrtime(e);return(1e9*n[0]+n[1])/1e9}module.exports=new a;
},{}],"vOk4":[function(require,module,exports) {
const e=require("fs"),t="/tmp/conf/conf.json";let s,r,n;class i{async load(n){e.existsSync("/tmp")?e.existsSync("/tmp/conf")||e.mkdirSync("/tmp/conf"):e.mkdirSync("/tmp"),e.existsSync(t)||e.writeFileSync(t,"{}"),this.timeTracker=process.hrtime(),r=n||10,s=JSON.parse(await e.promises.readFile(t))}get(e){return s[e]}set(r,n){return s[r]=n,this.buffer(()=>{e.promises.writeFile(t,c(s))}),n}buffer(e){const t=r-o(this.timeTracker);console.log(`Will update env after ${t} seconds (the prev update was been canceled!)`),n&&clearTimeout(n),n=setTimeout(e,1e3*(t-.1))}}function c(e){if(e)return"string"==typeof e?e:JSON.stringify(e)}function o(e){const t=process.hrtime(e);return(1e9*t[0]+t[1])/1e9}module.exports=new i;
},{}],"Focm":[function(require,module,exports) {
const e=require("./haveEnvSetter"),r=require("./noEnvSetter"),o=void 0!==process.env.SCF_METADATA_TCB_FD;module.exports=o?e:r;
},{"./haveEnvSetter":"WJHy","./noEnvSetter":"vOk4"}]},{},["Focm"], null)