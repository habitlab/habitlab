# &lt;l2t-star-rating&gt;

A Polymer element for star ratings

check out the [components](http://link2twenty.github.io/l2t-star-rating) page

![Screenshot](http://media.giphy.com/media/xTiTngb8EgHAYbICWc/giphy.gif)

## Installation

Using [Bower](http://bower.io), run:

```shell
bower install l2t-star-rating
```

## Usage

1. Import Custom Element:

    ```html
    <link rel="import" href="l2t-star-rating/l2t-star-rating.html">
    ```

2. Start using it!

    ```html
    <l2t-star-rating></l2t-star-rating>
    ```

## Examples

Basic usage:

```
<l2t-star-rating></l2t-star-rating>
```

Custom number of stars:

```
<l2t-star-rating stars="10"></l2t-star-rating>
```

Default rate selected:

```
<l2t-star-rating stars="10" rate="3"></l2t-star-rating>
```

Add your custom styles:

```
<l2t-star-rating stars="10" rate="3" class="custom-class"></l2t-star-rating>
```


## Options

Attribute           | Options   | Default   | Description
---                 | ---       | ---       | ---
`stars`             | *number*  | 5         | Number of stars
`rate`              | *number*  | 0         | Default number of stars selected
`icon`              | *string*  | star      | Set icon (iron-icons)
