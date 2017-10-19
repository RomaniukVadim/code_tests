module.exports.webpackConfig = {
    devtool: 'cheap-eval-source-map',

    resolve: {
        modules: ['node_modules']
    },

    entry: ['babel-polyfill'],

    output: {
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },

        ]
    },

    plugins: []
};