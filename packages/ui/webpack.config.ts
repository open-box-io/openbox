import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

const config = {
    mode: `production`,
    entry: `./src/index.tsx`,
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: `babel-loader`,
                    options: {
                        presets: [
                            `@babel/preset-env`,
                            `@babel/preset-react`,
                            `@babel/preset-typescript`,
                        ],
                    },
                },
            },
            {
                test: /\.(s(a|c)ss)$/,
                use: [`style-loader`, `css-loader`, `sass-loader`],
            },
        ],
    },
    resolve: {
        extensions: [`.tsx`, `.ts`, `.js`],
    },
    output: {
        path: path.resolve(__dirname, `build`),
        filename: `bundle.js`,
    },
    devServer: {
        // static: path.join(__dirname, `build`),
        // compress: true,
        // port: 4000,
        contentBase: path.resolve(__dirname, `build`),
        compress: true,
        hot: true,
        publicPath: `/`,
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            async: false,
            eslint: {
                files: `./src/**/*.{ts,tsx,js,jsx}`,
            },
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, `src`, `index.html`),
        }),
    ],
};

export default config;
