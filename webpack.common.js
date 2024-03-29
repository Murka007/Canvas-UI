const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const Terser = require("terser-webpack-plugin");

const commonConfig = {
    target: ["web", "es5"],
    context: path.resolve(__dirname, "test"),
    entry: {
        index: "./index.ts"
    },
    output: {
        path: path.resolve(__dirname, "public"),
        assetModuleFilename: "img/[name][ext]"
    },
    devServer: {
        port: 3000,
        hot: true,
        static: {
            directory: "./test/styles"
        }
    },
    optimization: {
        usedExports: true,
        minimizer: [
            new CssMinimizerWebpackPlugin(),
            new Terser()
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./index.html",
            scriptLoading: "blocking"
        }),
        new CleanWebpackPlugin()
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", ".png"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node-modules/
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff)$/,
                type: "asset/resource"
            }
        ]
    }
};
module.exports = { commonConfig };