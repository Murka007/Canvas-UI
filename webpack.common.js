const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const Terser = require("terser-webpack-plugin");

const commonConfig = {
    target: ["web", "es5"],
    context: path.resolve(__dirname, "src"),
    entry: {
        mainfile: "./index.ts"
    },
    output: {
        path: path.resolve(__dirname, "public")
    },
    devServer: {
        port: 3000,
        hot: true,
        static: {
            directory: "./src/styles"
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
        extensions: [".tsx", ".ts", ".js"]
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
                test: /\.(png|jpg|jpeg|gif)$/,
                use: "file-loader"
            }
        ]
    }
};
module.exports = { commonConfig };