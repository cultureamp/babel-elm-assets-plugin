import { transformSync, PluginObj } from "@babel/core"
import * as path from "path"
import * as fs from "fs"

import plugin from "./plugin"

const fixture = (filename: string) =>
  fs.readFileSync(path.join(__dirname, "fixtures", filename)).toString()

const transformWith = (plugin: PluginObj) => (input: string) =>
  transformSync(input, { plugins: [plugin] }).code

describe("the example plugin", () => {
  const transform = transformWith(plugin)

  it("transforms input to the expected output", () => {
    const input = fixture("input.js")
    const expectedOutput = fixture("output.js")
    expect(transform(input)).toBe(expectedOutput)
  })
})
