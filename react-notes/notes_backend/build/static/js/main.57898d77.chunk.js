(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{15:function(t,e,n){t.exports=n(38)},37:function(t,e,n){},38:function(t,e,n){"use strict";n.r(e);var a=n(0),o=n.n(a),r=n(13),c=n.n(r),u=n(14),i=n(2),l=function(t){var e=t.note,n=t.toggleImportance,a=e.important?"make not important":"make important";return o.a.createElement("li",{className:"note"},e.content,o.a.createElement("button",{onClick:n},a))},m=n(3),f=n.n(m),s=function(){var t=f.a.get("/api/notes"),e={id:1e4,content:"This note is not saved to server",date:"2019-05-30T17:30:31.098Z",important:!0};return t.then(function(t){return t.data.concat(e)})},p=function(t){return f.a.post("/api/notes",t).then(function(t){return t.data})},d=function(t,e){return f.a.put("".concat("/api/notes","/").concat(t),e).then(function(t){return t.data})},v=function(t){var e=t.message;return null===e?null:o.a.createElement("div",{className:"error"},e)},b=function(){return o.a.createElement("div",{style:{color:"green",fontStyle:"italic",fontSize:16}},o.a.createElement("br",null),o.a.createElement("em",null,"boobooNote app, Department of Computer Science, University of Helsinki 2020"))},E=function(){var t=Object(a.useState)([]),e=Object(i.a)(t,2),n=e[0],r=e[1],c=Object(a.useState)(""),m=Object(i.a)(c,2),f=m[0],E=m[1],g=Object(a.useState)(!0),h=Object(i.a)(g,2),O=h[0],j=h[1],S=Object(a.useState)(null),w=Object(i.a)(S,2),k=w[0],y=w[1];Object(a.useEffect)(function(){console.log("effect"),s().then(function(t){r(t)})},[]),console.log("render",n.length,"notes");var N=O?n:n.filter(function(t){return t.important});return o.a.createElement("div",null,o.a.createElement("h1",null,"Notes"),o.a.createElement(v,{message:k}),o.a.createElement("div",null,o.a.createElement("button",{onClick:function(){return j(!O)}},"show ",O?"important":"all")),o.a.createElement("ul",null,N.map(function(t,e){return o.a.createElement(l,{key:e,note:t,toggleImportance:function(){return function(t){var e=n.find(function(e){return e.id===t}),a=Object(u.a)({},e,{important:!e.important});d(t,a).then(function(e){r(n.map(function(n){return n.id!==t?n:e}))}).catch(function(a){y("Note '".concat(e.content,"' was already removed from server")),setTimeout(function(){y(null)},5e3),r(n.filter(function(e){return e.id!==t}))})}(t.id)}})})),o.a.createElement("form",{onSubmit:function(t){t.preventDefault();var e={content:f,date:(new Date).toISOString(),important:Math.random()>.5};p(e).then(function(t){r(n.concat(t)),E("")})}},o.a.createElement("input",{value:f,onChange:function(t){console.log(t.target.value),E(t.target.value)}}),o.a.createElement("button",{type:"submit"},"save")),o.a.createElement(b,null))};n(37);c.a.render(o.a.createElement(E,null),document.getElementById("root"))}},[[15,1,2]]]);
//# sourceMappingURL=main.57898d77.chunk.js.map