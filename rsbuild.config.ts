// rsbuild.config.ts
import {defineConfig} from "@rsbuild/core";
import {pluginReact} from "@rsbuild/plugin-react";
import tailwindcssPlugin from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import path from "path";

export default defineConfig({
    plugins: [pluginReact()],
    tools: {
        postcss: {
            postcssOptions: {
                plugins: [tailwindcssPlugin, autoprefixer],
            },
        },
    },
    source: {
        entry: {
            index: "./src/frontend/main.tsx",
        },
        define: {
            "process.env.PUBLIC_SET_ENV": JSON.stringify(process.env.PUBLIC_SET_ENV || "SANDBOX"),
            "process.env.PUBLIC_NODE_ENV": JSON.stringify(process.env.PUBLIC_NODE_ENV || "desenvolvimento"),
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
        },
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, "./src"),
            "src/frontend": path.resolve(__dirname, "./src/frontend"),
            "src/biblioteca": path.resolve(__dirname, "./src/biblioteca"),
            "src/backend": path.resolve(__dirname, "./src/backend"),
        },
    },
    html: {
        title: "Service financeiro",
        tags: [
            {
                tag: "link",
                attrs: {
                    rel: "icon",
                    href: "/icones/icon.ico",
                    type: "image/x-icon",
                },
            },
        ],
    },
    output: {
        distPath: {root: "build/frontend"},
    },
    // server: {
    //     port: 3000,
    //     open: true,
    //     proxy: {
    //         "/financeiro": {
    //             target: "http://localhost:3000",
    //             changeOrigin: true,
    //         },
    //     },
    // },
});
