const { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    WriteFilePlugin = require('write-file-webpack-plugin'),
    yaml = require('js-yaml'),
    path = require('path')

const mode =  process.env.NODE_ENV || 'development'


const configs = {
    mode,
    entry: { content: './src/content.js' },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            { from: 'src/background.js' },
            {
                from: 'src/manifest.yml',
                to: 'manifest.json',
                transform: function(content) {
                    return Buffer.from(
                        JSON.stringify({
                            version: process.env.npm_package_version,
                            ...yaml.safeLoad(content),
                        }),
                    )
                },
            },
            {
                from: 'assets/*',
                flatten: true,
            },
        ]),
        new WriteFilePlugin(),
    ],
}


if (mode == 'development'){
    configs.devtool = 'cheap-module-eval-source-map'
}

module.exports = configs
