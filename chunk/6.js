/*! For license information please see 6.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{"79":function(t,r,n){"use strict";n.r(r),n.d(r,"taro_navigator_core",(function(){return c}));var i=n(29),a=n(98),s=n(31),c=function(){function e(t){Object(i.g)(this,t),this.onSuccess=Object(i.c)(this,"cuccess",7),this.onFail=Object(i.c)(this,"fail",7),this.onComplete=Object(i.c)(this,"Complete",7),this.openType="navigate",this.isHover=!1,this.delta=0}return e.prototype.onClick=function(){var t=this,r=t.openType,n=t.onSuccess,i=t.onFail,a=t.onComplete,c=Promise.resolve();switch(r){case"navigate":c=s.navigateTo({"url":this.url});break;case"redirect":c=s.redirectTo({"url":this.url});break;case"switchTab":c=s.switchTab({"url":this.url});break;case"reLaunch":c=s.reLaunch({"url":this.url});break;case"navigateBack":c=s.navigateBack({"delta":this.delta});break;case"exit":c=Promise.reject(new Error('navigator:fail 暂不支持"openType: exit"'))}c&&c.then((function(t){n.emit(t)})).catch((function(t){i.emit(t)})).finally((function(){a.emit()}))},e.prototype.render=function(){var t,r=this.isHover,n=this.hoverClass;return Object(i.e)(i.a,{"class":Object(a.a)((t={},t[n]=r,t))})},e}();c.style=".navigator-hover{background:#efefef}"},"98":function(t,r,n){"use strict";n.d(r,"a",(function(){return a}));var i=n(6);var a=function createCommonjsModule(t,r,n){return t(n={"path":r,"exports":{},"require":function require(t,r){return function commonjsRequire(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}()}},n.exports),n.exports}((function(t){!function(){var r={}.hasOwnProperty;function o(){for(var t=[],n=0;n<arguments.length;n++){var a=arguments[n];if(a){var s=Object(i.a)(a);if("string"===s||"number"===s)t.push(a);else if(Array.isArray(a)){if(a.length){var c=o.apply(null,a);c&&t.push(c)}}else if("object"===s)if(a.toString===Object.prototype.toString)for(var u in a)r.call(a,u)&&a[u]&&t.push(u);else t.push(a.toString())}}return t.join(" ")}t.exports?(o.default=o,t.exports=o):window.classNames=o}()}))}}]);