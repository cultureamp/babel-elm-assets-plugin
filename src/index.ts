import { PluginObj } from "@babel/core";
import {
  CallExpression,
  isIdentifier,
  isStringLiteral,
  identifier
} from "@babel/types";

type PluginOptions = {
  package: string;
  module: string;
  function: string;
};

// TODO: we should probably provide an Elm package that offers this by default.
// NoRedInk/elm-asset-path comes close but uses an opaque type rather than allowing type aliases.
const defaultPluginOptions: PluginOptions = {
  package: "author/project",
  module: "Asset",
  function: "assetUrl"
};

const makePlugin = (options: PluginOptions): PluginObj => {
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
      CallExpression: ({ node }) => {
        if (!isAssetExpression(node, options)) return;

        node.callee = identifier("require");

        const [filePathNode] = node.arguments;

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

export default makePlugin(defaultPluginOptions);

export { makePlugin as withOptions, defaultPluginOptions, PluginOptions };
