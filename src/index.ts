import { PluginObj } from "@babel/core";
import {
  callExpression,
  CallExpression,
  isIdentifier,
  isStringLiteral,
  identifier,
  memberExpression
} from "@babel/types";

type PluginOptions = {
  package: string;
  module: string;
  function: string;
};

// TODO: we should probably provide an Elm package that offers this by default.
// NoRedInk/elm-asset-path comes close but uses an opaque type rather than allowing type aliases.
const defaultPluginOptions: PluginOptions = {
  package: "cultureamp/babel-elm-assets-plugin",
  module: "WebpackAsset",
  function: "assetUrl"
};

const plugin = ({}): PluginObj => {
  /** An append-only list of error descriptions. */
  const errors: string[] = [];
  const name = "babel-elm-assets-plugin";

  return {
    name,
    post: () => {
      if (errors.length > 0) {
        // report errors and throw
        throw new Error(`${name}:\n\t` + errors.join("\n\t"));
      }
    },
    visitor: {
      CallExpression: (path, { opts }) => {
        const options = { ...defaultPluginOptions, ...opts };
        if (!isAssetExpression(path.node, options)) return;

        const [filePathNode] = path.node.arguments;

        path.replaceWith(
          memberExpression(
            callExpression(identifier("require"), path.node.arguments),
            identifier("default")
          )
        );

        if (!isStringLiteral(filePathNode)) {
          const name = `${options.module}.${options.function} (from ${
            options.package
          })`;
          errors.push(
            `When using ${name} you must provide the asset path as a constant string`
          );
        }
      }
    }
  };
};

/**
 * Returns true if the call expression matches the Asset function signature
 * specified in our plugin config.
 */
const isAssetExpression = (
  expression: CallExpression,
  options: PluginOptions
) => {
  const taggerName = [
    options.package.replace(/-/g, "_").replace(/\//g, "$"),
    options.module.replace(/\./g, "$"),
    options.function
  ].join("$");
  return (
    isIdentifier(expression.callee) && expression.callee.name === taggerName
  );
};

export default plugin;

export { defaultPluginOptions, PluginOptions };
