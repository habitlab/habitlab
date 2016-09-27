# &lt;star-rating&gt;

A Polymer element for star ratings

> Maintained by [Carlos Martinez](https://github.com/cmartinezv).

## Demo

See a demo [here](http://cmartinezv.github.io/star-rating/components/star-rating/)

![Screenshot](http://media.giphy.com/media/xTiTngb8EgHAYbICWc/giphy.gif)

## Installation

Using [Bower](http://bower.io), run:

```shell
bower install star-rating
```

## Usage

1. Import Custom Element:

    ```html
    <link rel="import" href="src/star-rating.html">
    ```

2. Start using it!

    ```html
    <star-rating></star-rating>
    ```

## Examples

Basic usage:

```
<star-rating></star-rating>
```

Custom number of stars:

```
<star-rating stars="10"></star-rating>
```

Default rate selected:

```
<star-rating stars="10" rate="3"></star-rating>
```

Add your custom styles:

```
<star-rating stars="10" rate="3" class="custom-class"></star-rating>
```


## Options

Attribute           | Options   | Default   | Description
---                 | ---       | ---       | ---
`stars`             | *number*  | 5         | Number of stars
`rate`              | *number*  | 0         | Default number of stars selected
`icon`              | *string*  | star      | Set icon list, star, heart or face
`customcharicon`    | *string*  |`null`     | For selecting a custom icon


## License

[MIT License](http://opensource.org/licenses/MIT)
