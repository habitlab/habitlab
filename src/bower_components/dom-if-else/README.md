# dom-if-else
Modification of dom-if to be if/else complient.

This is a Polymer Element providing the missing ELSE portion for the "DOM-IF" template by way of an alterative to DOM-IF.

## Install
```bash
bower install --save dom-if-else
```

## Example

```html
    <button onclick="clicked()">Toggle</button>
    <template id="domIf" is="dom-if-else" if>
      <if-then>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          Stuff
          <div>4</div>
      </if-then>
      <if-else>
          <div>e1</div>
          <div>e2</div>
          More stuff
          <div>e3</div>
      </if-else>
    </template>

    <script>
       function clicked() {
           var t=document.querySelector('#domIf');
           t.set('if',!t.if);
       }
    </script>
```

