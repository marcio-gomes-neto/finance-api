import { IPlugin } from "../../interfaces/configuration/plugins/IPlugin";

export const configPlugins = async (plugins:IPlugin[]) => {
    for (const plugin of plugins) {
        await plugin.register();
    }
};