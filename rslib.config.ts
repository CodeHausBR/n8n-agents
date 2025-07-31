// rslib.config.ts
import {defineConfig} from "@rslib/core";
import {pluginReact} from "@rsbuild/plugin-react";
import path from "path";

export default defineConfig({
    lib: [
        {
            format: "esm",
            dts: true,
            output: {
                distPath: {root: "./build/biblioteca"},
            },
        },
        {
            format: "cjs",
            html: {
                title: "service financeiro",
            },
            dts: true,
            output: {
                distPath: {root: "./build/biblioteca"},
            },
        },
    ],
    source: {
        entry: {index: "./src/biblioteca/index.ts"},
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, "./src"),
            "src/frontend": path.resolve(__dirname, "./src/frontend"),
            "src/biblioteca": path.resolve(__dirname, "./src/biblioteca"),
        },
    },
    output: {
        target: "web",
        externals: {
            react: "React",
            "react-dom": "ReactDOM",
        },
    },
    plugins: [pluginReact()],
});
