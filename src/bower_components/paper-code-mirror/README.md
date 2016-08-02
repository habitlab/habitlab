##&lt;paper-code-mirror&gt;

`paper-code-mirror` is a material design styled code editor. It's using Code Mirror plugin and RequireJS.

[Live Example](http://spacee.xyz/paper-code-mirror/demo.html)

##Installing with Bower

To install the component with the Bower, just run: 

`bower install --save paper-code-mirror`


Example:

```html
<paper-code-mirror line-numbers mode="htmlmixed" title="HTML">
    <template>
        <div class="container">
            <div class="header">
                <a href="http://google.com" target="_blank">Hello</a>
            </div>
        </div>
    </template>
</paper-code-mirror>
```

###&lt;paper-code-mirror&gt; - Properties

The following properties are available:

| Property Name | Description | Default |
| --- | --- | --- |
| `value` | The value of the code editor | `` |
| `tabSize` | The width of a tab character. | `4` |
| `mode` | The language name you are using | `htmlmixed` |
| `theme` | The theme to display the code editor | `material` |
| `lineNumbers` | Boolean property to show the line numbers or hide | `false` |
| `title` | Code editor title | `` |

###&lt;paper-code-mirror&gt; - Modes

`python`
`ruby`
`php`
`pascal`
`sql`
`clike`
`xml`
`javascript`
`css`
`vbscript`
`htmlmixed`
`apl`
`asciiarmor`
`markdown`
`clojure`
`cmake`
`dart`
`fortran`
`haskell`
`jade`
`sass`
`shell`
`xml`
`yaml`

###&lt;paper-code-mirror&gt; - Themes

`ambiance`
`ambiance-mobile`
`material`
`blackboard`
`cobalt`
`eclipse`
`elegant`
`erlang-dark`
`lesser-dark`
`midnight`
`monokai`
`neat`
`night`
`rubyblue`
`solarized`
`twilight`
`vibrant-ink`
`xq-dark`
`xq-light`