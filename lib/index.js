"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@babel/types");
const defaultPluginOptions = {
    package: "cultureamp/babel-elm-assets-plugin",
    module: "WebpackAsset",
    function: "assetUrl"
};
exports.defaultPluginOptions = defaultPluginOptions;
const plugin = ({}) => {
    /** An append-only list of error descriptions. */
    let errors = [];
    const name = "babel-elm-assets-plugin";
    return {
        name,
        pre: () => {
            errors = [];
        },
        post: () => {
            if (errors.length > 0) {
                // report errors and throw
                throw new Error(`${name}:\n\t` + errors.join("\n\t"));
            }
        },
        visitor: {
            CallExpression: (path, { opts }) => {
                const options = Object.assign({}, defaultPluginOptions, opts);
                if (!isAssetExpression(path.node, options))
                    return;
                const [filePathNode] = path.node.arguments;
                // We need either `require('file.png').default` or just `require('file.png')` depending on the webpack loader
                // So we use `require('file.png').__esModule ? require('file.png').default : require('file.png')`
                const requireExpr = types_1.callExpression(types_1.identifier("require"), path.node.arguments);
                const requireDotEsModule = types_1.memberExpression(requireExpr, types_1.identifier("__esModule"));
                const requireDotDefault = types_1.memberExpression(requireExpr, types_1.identifier("default"));
                const conditionalRequire = types_1.conditionalExpression(requireDotEsModule, requireDotDefault, requireExpr);
                path.replaceWith(conditionalRequire);
                if (!types_1.isStringLiteral(filePathNode)) {
                    const name = `${options.module}.${options.function} (from ${options.package})`;
                    errors.push(`When using ${name} you must provide the asset path as a constant string`);
                }
            }
        }
    };
};
/**
 * Returns true if the call expression matches the Asset function signature
 * specified in our plugin config.
 */
const isAssetExpression = (expression, options) => {
    const elm18TaggerName = [
        "_" + options.package.replace(/-/g, "_").replace(/\//g, "$"),
        options.module.replace(/\./g, "_"),
        options.function
    ].join("$");
    const elm19TaggerName = [
        options.package.replace(/-/g, "_").replace(/\//g, "$"),
        options.module.replace(/\./g, "$"),
        options.function
    ].join("$");
    const elm191TaggerName = [
        '',
        options.package.replace(/-/g, "_").replace(/\//g, "$"),
        options.module.replace(/\./g, "$"),
        options.function
    ].join("$");
    return types_1.isIdentifier(expression.callee) && (expression.callee.name == elm18TaggerName ||
        expression.callee.name == elm19TaggerName ||
        expression.callee.name == elm191TaggerName);
};
exports.default = plugin;
