var LiveScript;LiveScript=require("./index"),LiveScript.stab=function(e,t,i){var r;try{LiveScript.run(e,{filename:i,map:"embedded"})}catch(e){r=e}"function"==typeof t&&t(r)},LiveScript.load=function(e,t){var i;return i=new XMLHttpRequest,i.open("GET",e,!0),"overrideMimeType"in i&&i.overrideMimeType("text/plain"),i.onreadystatechange=function(){var r;4===i.readyState&&(200===(r=i.status)||0===r?LiveScript.stab(i.responseText,t,e):"function"==typeof t&&t(Error(e+": "+i.status+" "+i.statusText)))},i.send(null),i},LiveScript.go=function(){var e,t,i,r,n,a,o;for(e=/^(?:text\/|application\/)?ls$/i,t=function(e){e&&setTimeout(function(){throw e})},i=0,n=(r=document.getElementsByTagName("script")).length;i<n;++i)a=r[i],e.test(a.type)&&((o=a.src)?LiveScript.load(o,t):LiveScript.stab(a.innerHTML,t,a.id))},module.exports=LiveScript;