import { transformSync, PluginObj } from "@babel/core";
import * as path from "path";
import * as fs from "fs";

import plugin, { PluginOptions } from "../src";

const fixture = (filename: string) =>
  fs.readFileSync(path.join(__dirname, "fixtures", filename)).toString();

const transformWith = (plugin: ({}) => PluginObj, options?: PluginOptions) => (
  input: string
) => {
  const assetPlugin = options ? [plugin, options] : plugin;
  return transformSync(input, { plugins: [assetPlugin] }).code;
};

describe("the plugin", () => {
  it("transforms input to the expected output", () => {
    const transform = transformWith(plugin);
    const input = fixture("input.js");
    const expectedOutput = fixture("output.js");
    expect(transform(input)).toBe(expectedOutput);
  });

  it("allows custom options", () => {
    const transform = transformWith(plugin, {
      package: "cultureamp/cultureamp-style-guide",
      module: "Icon.SvgAsset",
      function: "svgAsset"
    });
    const input = fixture("custom_input.js");
    const expectedOutput = fixture("custom_output.js");
    expect(transform(input)).toBe(expectedOutput);
  });

  it("transforms a fully compiled optimized build", () => {
    const transform = transformWith(plugin);
    const input = fixture("optimized_build_input.js");
    expect(transform(input)).toMatchSnapshot();
  });

  it("will error if you use a non-literal string for the asset path", () => {
    const transform = transformWith(plugin);
    const input = fixture("variable_input.js");
    const expectedError =
      "When using WebpackAsset.assetUrl (from cultureamp/babel-elm-assets-plugin) you must provide the asset path as a constant string";
    expect(() => transform(input)).toThrow(expectedError);
  });
});
