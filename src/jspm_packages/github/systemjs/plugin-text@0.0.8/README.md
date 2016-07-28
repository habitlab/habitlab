text
===========

SystemJS's text loading plugin. Text is loaded from the file into the variable as a string.

Installing
---

For SystemJS use, locate `text.js` in the application, and then locate it with map configuration:

```javascript
System.config({
  map: {
    text: 'path/to/text.js'
  }
});
```

For installing with jspm, run `jspm install text`.

Basic Use
---

```javascript
import myText from './mytext.html!text';
```