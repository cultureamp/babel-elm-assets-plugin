import { PluginObj } from "@babel/core";
import {
  callExpression,
  CallExpression,
  isIdentifier,
  isStringLiteral,
  identifier,
  memberExpression,
  conditionalExpression
} from "@babel/types";

type PluginOptions = {
  package: string;
  module: string;
  function: string;
};

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


        // We need either `require('file.png').default` or just `require('file.png')` depending on the webpack loader
        // So we use `require('file.png').__esModule ? require('file.png').default : require('file.png')`
        const requireExpr = callExpression(identifier("require"), path.node.arguments)
        const requireDotEsModule = memberExpression(
          requireExpr,
          identifier("__esModule")
        )
        const requireDotDefault = memberExpression(
          requireExpr,
          identifier("default")
        )
        const conditionalRequire = conditionalExpression(requireDotEsModule, requireDotDefault, requireExpr)
        path.replaceWith(conditionalRequire);

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
