
    var message;
    if (window.top !== window) {
      message = 'URL Bar should appear above this text';
    } else {
      message = 'No URL Bar above this text. iframe below this text with URL bar.';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', window.location.href);
      document.body.appendChild(iframe);
    }
    document.querySelector('#message').innerText = message;
  