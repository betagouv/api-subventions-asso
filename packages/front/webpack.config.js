const path = require("path");

module.exports = {
    entry: "./views/index.js",
    mode: "production",
    output: {
        filename: "build.js",
        path: path.resolve(__dirname, "static/js")
    },
    resolve: {
        alias: {
            "@resources": path.resolve(__dirname, "svelte/resources"),
            "@components": path.resolve(__dirname, "svelte/components"),
            "@dsfr": path.resolve(__dirname, "svelte/dsfr"),
            "@core": path.resolve(__dirname, "svelte/core")
        }
    }
};
