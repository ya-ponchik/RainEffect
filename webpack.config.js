const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        library: { // https://stackoverflow.com/questions/68913996/use-webpack-5-to-build-an-es-module-bundle-and-consume-that-bundle-in-a-node-js
            type: "module",
        },
    },
    module: {
        rules: [
            {
                test: /\.(vert|frag)/,
                type: 'asset/source',
            },
        ],
    },
    experiments: {
        outputModule: true,
    },  
};