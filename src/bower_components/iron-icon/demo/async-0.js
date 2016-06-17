
    setTimeout(function() {
      // Import the code that powers the iron-iconset asynchronously
      var linkElem = document.createElement('link');
      linkElem.setAttribute('rel', 'import');
      linkElem.setAttribute('href', '../../iron-iconset/iron-iconset.html');
      document.head.appendChild(linkElem);
      document.querySelector('#loading_message').innerText = "Iconset Loaded.";
    }, 1000);
  