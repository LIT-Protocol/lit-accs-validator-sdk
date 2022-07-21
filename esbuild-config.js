const { nodeBuiltIns } = require("esbuild-node-builtins");

// Shared configs between client && node environments
const sharedConfigs = {
    globalName: "LitValidator",
    sourceRoot: "./",
    plugins: [nodeBuiltIns()],
    define: { global: "window" },
    inject: ["./polyfills.js"],
    external: [
        "did-jwt/src/util"
    ],
    // sourcemap: true,
    // minify: true,
    // platform: "node"
}

// 
// ========== WEB CONFIG ==========
// 
exports.esBuildWebConfig = {
    entryPoints: [
        './src_built_from_ts/index.js'
    ],
    outfile: './build/web/index.js',
    bundle: true,
    ...sharedConfigs
}

// 
// ========== NODE CONFIG ==========
// 
exports.esBuildNodeConfig = {
    entryPoints: [
        './src_built_from_ts/index.js'
    ],
    outdir: './build/node',
    bundle: true,
    platform: "node",
    ...sharedConfigs
}