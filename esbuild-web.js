const { esBuildWebConfig } = require('./esbuild-config');

require('esbuild').build(
    esBuildWebConfig
).then((result) => {
    console.log(`...watching entryPoint: ${ esBuildWebConfig.entryPoints } | outfile: ${esBuildWebConfig.outfile}`);
}).catch(() => process.exit(1))