# Babel Elm Assets Plugin

This Babel plugin allows you to search for a particular function call in Elm, and replace it with a `require()` JS call.
This allows you to use webpack generated assets directly in your Elm code.

## Usage

TODO

## Configuration

TODO

## How it works

First you create a function that you use to require your assets. Say we have MyProject/Asset.elm:

```elm
module MyProject.Asset exposing (AssetUrl, url)

url : String -> AssetUrl
url path =
    -- this placeholder value is replaced by Webpack at build time
    "webpack-placeholder-url"

type alias AssetUrl =
    String
```

You'd then call this in your Elm file:

```elm
module Main exposing (myImage)

myImage =
```

Normally when you compile this with Elm, the generated JS will look like:

```js
var author$project$MyProject$Asset$url = function(url) {
  return "webpack-placeholder-url";
};
var author$project$Main$myImageUrl = author$project$MyProject$Asset$url(
  "./file.png"
);
```

With this loader, Babel can transform that JS to use a require call:

```js
var author$project$MyProject$Asset$url = function(url) {
  return "webpack-placeholder-url";
};
var author$project$Main$myImageUrl = require("./file.png");
```

Which webpack will know how to handle, meaning your final JS will do something similar to:

```js
var author$project$MyProject$Asset$url = function(url) {
  return "webpack-placeholder-url";
};
var author$project$Main$myImageUrl = "/assets/file-0fabe3.png";
```

---

The babel-elm-assets-plugin is maintained by the Front End Capability Team at Culture Amp.
