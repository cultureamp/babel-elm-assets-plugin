import { PluginObj } from "@babel/core";
declare type PluginOptions = {
    package: string;
    module: string;
    function: string;
};
declare const defaultPluginOptions: PluginOptions;
declare const plugin: ({}: {}) => PluginObj<{}>;
export default plugin;
export { defaultPluginOptions, PluginOptions };
