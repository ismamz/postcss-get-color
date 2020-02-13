# PostCSS Get Color [![Build Status][ci-img]][ci]

<img align="right" width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

> [PostCSS] plugin to get the prominent colors from an image

The plugin uses [Vibrant.js] and the [node port](https://github.com/akfish/node-vibrant) (node-vibrant). [Vibrant.js] is a javascript port of the awesome [Palette class](https://developer.android.com/reference/android/support/v7/graphics/Palette.html) in the Android support library.

[Vibrant.js]: https://github.com/jariz/vibrant.js/
[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/ismamz/postcss-get-color.svg
[ci]:      https://travis-ci.org/ismamz/postcss-get-color

## Material Design Example

<img src="https://media.giphy.com/media/l1J9BYEg4zGTty9wY/giphy.gif" width="235" align="right"/>


> Based on the [standards of material design](https://material.io/guidelines/style/color.html), the palette library extracts commonly used color profiles from an image. Each profile is defined by a Target, and colors extracted from the bitmap image are scored against each profile based on saturation, luminance, and population (number of pixels in the bitmap represented by the color). For each profile, the color with the best score defines that color profile for the given image.

Source: [Android Developers - Extract Color Profiles](https://developer.android.com/training/material/palette-colors.html#extract-color-profiles)

| Input         | Output        |
|:-------------:|:-------------:|
| <img src="https://github.com/ismamz/postcss-get-color/raw/master/test/img/girl.png" width="100" height="100"/> | <img src="https://placehold.it/100/e8ba3c/fff?text=e8ba3c"/> |
| `color: get-color("../img/girl.png", Vibrant);` | `color: #e8ba3c;` |


---


### CSS Input

```css
.foo {
    background-color: get-color("path/to/image.jpg", LightVibrant) url("path/to/image.jpg") no-repeat;
}

.bar {
    color: get-color("path/to/image.png");
}
```

### CSS Output

```css
.foo {
    background-color: #b9911b url("path/to/image.jpg") no-repeat;
}

.bar {
    color: #b9911b;
}
```

## Features

```
get-color(<image-path>, [<color-name>, <text-color>])
```

**image-path** `string`: path to image relative to the CSS file (with quotes).

**color-name** `string`: name (case sensitive) from the palette ([see available names](#vibrant-palette)). <br> _Default:_ first available color in the palette.

**text-color** `[title|body]`: get the compatible foreground color.


Use color format in `hex`, `rgb` or `rgba` ([see Options](#options)).


## Vibrant Palette

See examples in [Vibrant.js Page](http://jariz.github.io/vibrant.js/).

- Vibrant
- DarkVibrant
- LightVibrant
- Muted
- DarkMuted
- LightMuted

**Note:** colors are writing in `PascalCase`.

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
    color: #000; /* or #fff */
}
```

## Usage

### Quick usage

Using [PostCSS CLI](https://github.com/postcss/postcss-cli) you can do the following:

First, install `postcss-cli` and the plugin on your project folder:

```
$ npm install postcss-cli postcss-get-color --save-dev
```

And finally add this script to your `package.json`:

```json
"scripts": {
    "postcss": "postcss input.css -u postcss-get-color -o output.css -w"
}
```

After this you can run `npm run postcss` and transform your `input.css` into `output.css`. Note that `-w` is for observe file system changes and recompile as source files change.

### For tasks runners and others enviroments

```js
postcss([ require('postcss-get-color')({ /* options*/ }) ])
```

See [PostCSS] docs for examples of your environment.

## Options

##### `format`

Type: `string`

Default: `hex`

Select the color format between: `hex`, `rgb`, `rgba`.

## Contributing

If you want to improve the plugin, [send a pull request](https://github.com/ismamz/postcss-get-color/pull/new/master) ;-)
