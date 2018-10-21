import { transformSync, PluginObj } from "@babel/core";
import * as path from "path";
import * as fs from "fs";

import examplePlugin, { withOptions } from "../src";

const fixture = (filename: string) =>
  fs.readFileSync(path.join(__dirname, "fixtures", filename)).toString();

const transformWith = (plugin: PluginObj) => (input: string) =>
  transformSync(input, { plugins: [plugin] }).code;

describe("the Elm CSS modules plugin", () => {
  it("transforms input to the expected output", () => {
    const transform = transformWith(examplePlugin);
    const input = fixture("input.js");
    const expectedOutput = fixture("output.js");
    expect(transform(input)).toBe(expectedOutput);
  });

  it("allows custom options", () => {
    const transform = transformWith(
      withOptions({
        package: "cultureamp/cultureamp-style-guide",
        module: "Icon.SvgAsset",
        function: "svgAsset"
      })
    );
    const input = fixture("custom_input.js");
    const expectedOutput = fixture("custom_output.js");
    expect(transform(input)).toBe(expectedOutput);
  });

  it("will error if you use a non-literal string for the asset path", () => {
    const transform = transformWith(examplePlugin);
    const input = fixture("variable_input.js");
    const expectedError =
      "When using Asset.assetUrl (from author/project) you must provide the asset path as a constant string";
    expect(() => transform(input)).toThrow(expectedError);
  });
});
