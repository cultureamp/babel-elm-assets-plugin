module WebpackAsset exposing (AssetUrl, assetUrl)

{-| This library lets you reference webpack assets in your Elm views,
and have them replaced with require() statements (and eventually, the URLs
of the assets) at compile time.

Designed to be used with the corresponding babel-elm-assets-plugin.
See https://github.com/cultureamp/babel-elm-assets-plugin

@docs AssetUrl
@docs assetUrl
-}

{-| An AssetUrl will hold the URL of your asset at runtime

The value is provided by webpack, the same as `require('./logo.svg')` would be in JS.

    view model =
        div []
            [ img [ src (assetUrl "./logo.svg") ] []
            ]

-}
type alias AssetUrl =
    String

{-| A function to get the URL of a webpack asset.

The path you supply must be a literal string, not a variable or function that returns a string.

It must also be relative to the root of your Elm project, rather than being relative to the current file.

    view model =
        div []
            [ img [ src (assetUrl "./logo.svg") ] []
            ]

-}
assetUrl : String -> AssetUrl
assetUrl path =
    -- Webpack will replace this path with a URL Webpack at build time
    path
