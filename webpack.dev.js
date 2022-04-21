const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const { commonConfig, generateName } = require("./webpack.common");

const devConfig = {
    mode: "development",
    output: {
        filename: () => "[name]." + generateName("js")
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: () => "[name]." + generateName("css")
        })
    ]
};

module.exports = merge(commonConfig, devConfig);