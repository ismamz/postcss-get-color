# PostCSS Get Color [![Build Status][ci-img]][ci]

<img align="right" width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

> [PostCSS] plugin to get the prominent colors from an image.

The plugin uses [Vibrant.js] and the [node port](https://github.com/akfish/node-vibrant) (node-vibrant). [Vibrant.js] is a javascript port of the awesome [Palette class](https://developer.android.com/reference/android/support/v7/graphics/Palette.html) in the Android support library.

[Vibrant.js]: https://github.com/jariz/vibrant.js/
[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/ismamz/postcss-get-color.svg
[ci]:      https://travis-ci.org/ismamz/postcss-get-color

## Material Design Example

![Material Design Example Colors (Animated Gif)](images/material-design-example-colors.gif)

The Vibrant color for the "Girl" album cover is `#e8ba3c`:

![Girl](images/girl.png)

And you can get this color writing CSS like this:

```css
.cover {
    background-color: get-color("images/girl.png", Vibrant);
    color: get-color("images/girl.png", Vibrant, body);
}
```

and then you get:

```css
.cover {
    background-color: #e8ba3c;
    color: #000;
}
```

## How to use

- The first parameter should be a string with single quotes or double quotes.
- The second parameter is the name from the Palette (case sensitive) ([see available names](#vibrant-palette)).
- You can ommit the second parameter and the plugin gets the first color available in the Palette.
- If a color is not in the Palette, the plugin gets the first color available.
- You can add (optionally) a third parameter with the text color: `title` or `body` ([see Vibrant Palette](#vibrant-palette)).
- Use color format in `hex`, `rgb` or `rgba` ([see Options](#options)).

#### After

```css
.foo {
    background-color: get-color("path/to/image.jpg", LightVibrant) url("path/to/image.jpg) no-repeat;
}

.bar {
    color: get-color("path/to/image.png");
}
```

#### Before

```css
.foo {
    background-color: #b9911b url("path/to/image.jpg) no-repeat;
}

.bar {
    color: #b9911b;
}
```

## Vibrant Palette

See examples in [Vibrant.js Page](http://jariz.github.io/vibrant.js/).

- Vibrant
- DarkVibrant
- LightVibrant
- Muted
- DarkMuted
- LightMuted

**Note:** Always start with uppercase each word.

You can get the title text color that works best with any **'title'** text that is used over this swatch's color, and the body text color that works best with any **'body'** text that is used over this swatch's color.

#### After

```css
.foo {
    color: get-color("path/to/image.jpg", LightVibrant, text);
}
```

#### Before

```css
.foo {
    color: #000; // or #fff
}
```

## Usage

```js
postcss([ require('postcss-get-color') ])
```

See [PostCSS] docs for examples for your environment.

## Options

##### `format`

Type: `string`

Default: `hex`

Select the color format between: `hex`, `rgb`, `rgba`.

## Contributing

If you want to improve the plugin, [send a pull request](/pull/new/master) ;-)
