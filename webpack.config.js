import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import HtmlWebpackPlugin from 'html-webpack-plugin';
//import CleanWebpackPlugin from 'clean-webpack-plugin';

let conf = {
	entry: {
		pageMain: './src/html/main/index.js'
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'main.js'
	},
	devServer: {
		overlay: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.(less|css)$/,
				exclude: /node_modules/,
				use: [ 'style-loader', MiniCssExtractPlugin.loader, 
				'css-loader', 'less-loader']
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: [{
					loader: 'file-loader',
					options: {
						name: 'images/[name][hash].[ext]'
					}
				}, 
				{
					loader: 'image-webpack-loader',
					options: {
						mozjpeg: {
							progressive: true,
							quality: 70
						}
					}
				},
				],
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: 'fonts/[name][hash].[ext]'
					}
				}
			}
		]
	},
	plugins: [
		//new CleanWebpackPlugin('dist/', {}),
    	new MiniCssExtractPlugin({
    		filename: 'style.css'
    	}),
    	new HtmlWebpackPlugin({
    		inject: false,
    		hash: true,
    		template: './src/html/main/index.html',
    		filename: 'index.html'
    	}),
    	new WebpackMd5Hash()
  	]
};

module.exports = (env, options) => {
	let production = options.mode === 'production';

	conf.devtool = production
					? false
					: 'eval-sourcemap';

	return conf;
};