const { esBuildNodeConfig } = require('./esbuild-config');

require('esbuild').build({
    watch:{
        onRebuild(error, result) {
            if(error) console.error('watch build failed:', error);
            else console.log('watch build succeeded:', result)
        }
    },
    ...esBuildNodeConfig
}).then((result) => {
    console.log(`...watching entryPoint: ${ esBuildNodeConfig.entryPoints } | outfile: ${esBuildNodeConfig.outdir}`);
}).catch(() => process.exit(1))