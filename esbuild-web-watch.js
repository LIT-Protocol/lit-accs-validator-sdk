const { esBuildWebConfig } = require('./esbuild-config');

require('esbuild').build({
    watch:{
        onRebuild(error, result) {
            if(error) console.error('watch build failed:', error);
            else console.log('watch build succeeded:', result)
        }
    },
    ...esBuildWebConfig
}).then((result) => {
    console.log(`...watching entryPoint: ${ esBuildWebConfig.entryPoints } | outfile: ${esBuildWebConfig.outfile}`);
}).catch(() => process.exit(1))