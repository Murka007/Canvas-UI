const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const Terser = require("terser-webpack-plugin");

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function generateName(ext, count = 8) {
    let name = "";
    while (count) {
        name += chars[rand(0, chars.length - 1)];
        count--;
    }
    return name + "." + ext;
}

// function shuffle(a) {
//     for (let i = a.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [a[i], a[j]] = [a[j], a[i]];
//     }
//     return a;
// }

// function shuffleObject(obj) {
//     const entries = shuffle(Object.entries(obj));
//     const output = {};
//     for (const [key, value] of entries) {
//         output[key] = value;
//     }
//     return output;
// }

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
        // static: {
        //     directory: "./src/styles"
        // }
    },
    optimization: {
        usedExports: true,
        minimizer: [
            new CssMinimizerWebpackPlugin(),
            new Terser({
                terserOptions: {
                    module: true,
                    compress: {
                        defaults: false,
                        unused: true,
                        keep_infinity: true,
                        keep_classnames: true,
                        keep_fargs: true,
                        join_vars: true
                    },
                    mangle: {},
                    output: {
                        quote_style: 2,
                        semicolons: true
                    },
                    parse: {},
                    rename: {}
                }
            })
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
            }
        ]
    }
};
module.exports = { commonConfig, generateName };