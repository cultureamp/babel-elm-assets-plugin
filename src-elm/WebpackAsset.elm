module WebpackAsset exposing (assetUrl)


type alias AssetUrl =
    String


assetUrl : String -> AssetUrl
assetUrl path =
    -- Webpack will replace this path with a URL Webpack at build time
    path
