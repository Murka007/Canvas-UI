const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const { commonConfig, generateName } = require("./webpack.common");

const prodConfig = {
    mode: "production",
    output: {
        filename: () => generateName("js")
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: () => generateName("css")
        })
    ]
};

module.exports = merge(commonConfig, prodConfig);