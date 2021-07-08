# Webcomic Library

## Installation

### Self Hosted
Clone the repository

```bash
git clone https://github.com/nilsPosthumus/Webcomic-Library
```
or dowload the [latest release](https://github.com/nilsPosthumus/Webcomic-Library/releases/)


### Using NPM

```bash
npm install webcomic-library
```

```html
<link rel="stylesheet" href="node_modules/webcomic_library/dist/webcomic.css">
```

```html
<script src="node_modules/webcomic-library/dist/webcomic.js"></script>
```

### With JS Delivr
[jsdelivr](https://cdn.jsdelivr.net/)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/webcomic-library@latest/dist/webcomic.css">
```

```html
<script src="https://cdn.jsdelivr.net/npm/webcomic-library@latest/dist/webcomic.js"></script>
```

## Changing the config
You can change the options for the library by supplying a config json object. The easiest way to do this is via the data-webcomic-config attribute.
```html
 <div class="webcomic" data-webcomic-config="{}">
```
The following settings are changeable in the config:
- `keyboardEvents`: whether to listen on keyboard events or not
- `cycle`:  whether to restart the page after the last panel was shown
- `playOutro`: 
    - `onNextPanel`: plays the outro while the intro of the next panel plays
    - `onPageEnd`: plays the outro animation once the last panel was shown
- `panelWidth`: the default width of a panel (in pixels or as css width value)
- `panelHeight`: the default height of a panel (in pixels or as css width value)
- `horizontalGutter`: the horizontal gutter width (in pixels or as css width value)
- `verticalGutter`: the width of the vertical gutter (in pixels or as css width value)
- `border`:  the with of the panel border (in pixels or as css width value)

## Events
Use the `on()` method to listen to an event:
```js
webcomic.on("initialized", () => {
    // your logic
})
```
The following events are available:
- `initialized`
- `nextPanel`
- `nextPage`

## Layouts
A layout consists of a main layout container with the `webcomic` class and child containers with the `panel` class.
```html
<div class="webcomic">
    <div class="panel"></div>
    <div class="panel"></div>
</div>
```
This layout works but it doesn't look good. Thats because it's missing a layout preset. There are a multiple presets to choose from:

### Grid Layout
This layout creates a grid with a fixed number of rows and columns. Use it like this:
```html
<div class="webcomic layout-grid rows-2 cols-3">
    ...
</div>
```
The maximum amounts of rows and columns are 5 each.

### Flex Layout
This layout adjusts automaticly to the number of panels, their size and the screen width and height. You can use it like this:
```html
<div class="webcomic layout-flex">
    ...
</div>
```

## Animations
You can add animations to panels by adding the `data-intro` or `data-outro` attributes.
```html
    <div class="panel" data-intro="fade-in" data-outro="fade-out"></div>
```
### List of Animations
- `grow`
- `shrink`
- `grow-horizontal`
- `shrink-horizontal`
- `grow-vertical`
- `shrink-vertical`
- `fade-in`
- `fade-out`
- `slide-in-left`
- `slide-out-left`
- `slide-in-right`
- `slide-out-right`
- `slide-in-top`
- `slide-out-top`
- `slide-in-bottom`
- `slide-out-bottom`

## Multiple Pages
To make a comic with multiple pages you need to create each page as a HTML page. Then on the nextPage event you can redirect to the new page. For example like this:
```js
webcomic.on("nextPage", () => window.open("/next-page.html", "_self"));
```
