const { esBuildNodeConfig } = require('./esbuild-config');

require('esbuild').build(
    esBuildNodeConfig
).then((result) => {
    console.log(`...watching entryPoint: ${ esBuildNodeConfig.entryPoints } | outfile: ${esBuildNodeConfig.outdir}`);
}).catch(() => process.exit(1))