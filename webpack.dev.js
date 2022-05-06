const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const { commonConfig } = require("./webpack.common");

const devConfig = {
    mode: "development",
    output: {
        filename: "[name].[contenthash].js"
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name][contenthash].css"
        })
    ]
};

module.exports = merge(commonConfig, devConfig);