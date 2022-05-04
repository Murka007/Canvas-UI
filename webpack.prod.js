const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const { commonConfig } = require("./webpack.common");

const prodConfig = {
    mode: "production",
    output: {
        filename: "[name].js"
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css"
        })
    ]
};

module.exports = merge(commonConfig, prodConfig);