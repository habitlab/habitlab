  var bugmuncher_options = {
    //api_key: "b746ad902aa9cf4d33f5"
    api_key: 'b53059b110c08683bf98'
  };
  (function(){ 
    var e = document.createElement("script"); 
    e.setAttribute("type", "text/javascript"); 
    var d = new Date(); var n = '?'+d.getFullYear()+(d.getMonth()+1)+d.getDate()+d.getHours();
    //e.setAttribute("src", "https://cdn.bugmuncher.com/bugmuncher.js"+n); 
    e.setAttribute('src', '/bugmuncher/bugmuncher.js')
    document.getElementsByTagName("head")[0].appendChild(e); 
  })();
