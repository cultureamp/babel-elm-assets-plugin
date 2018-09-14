import { PluginObj } from "@babel/core"

const plugin: PluginObj = {
  name: "example plugin",
  visitor: {
    Identifier: id => {
      id.node.name = reverse(id.node.name)
    }
  }
}

const reverse = (a: string): string =>
  a
    .split("")
    .reverse()
    .join("")

export default plugin
