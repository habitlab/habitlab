# esprima-walk

A very fast [esprima](http://esprima.org/) AST node walker with no dependencies.

To naïvely traverse the AST object with callbacks and without knowing its structure will result in an exponential explosion of function calls and could take several seconds for a single parsed file of a thousand or so lines.

**esprima-walk** calls no functions itself, only the callback passed in, and it doesn't invoke the callback on every property and value, only on primary nodes of the tree - those with a `type` property, corresponding to Node objects in the parser API. It also uses the fastest possible ways (on V8) to check types and iterate over properties and arrays.

The normal `require( 'esprima-walk' ).walk` method (also available as just `require( 'esprima-walk' )`) does not change the AST. It has no return value.

A method `require( 'esprima-walk' ).walkAddParent` is also available to add a `.parent` property to every node before invoking the callback on it. If a node has a parent, all of its ancestors will have a `.parent` property at that point too. The root node will have no `.parent` property.

## Usage

```js
var esprima = require( 'esprima' )
var walk = require( 'esprima-walk' )

var ast = esprima.parse( '"orange"' )

ast => {
    type: 'Program',
    body: [
        {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 'orange',
                raw: '"orange"'
            }
        }
    ]
}

var types = []

walk( ast, function ( node ) { types.push( node.type ) } )

types => [ 'Program', 'ExpressionStatement', 'Literal' ]
```
