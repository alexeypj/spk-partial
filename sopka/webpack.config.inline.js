const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = (env) => {
	var isDevBuild = true;

	if (process.env && process.env.NODE_ENV) {
		if (process.env.NODE_ENV === 'production') {
			isDevBuild = false;
		}
	} else if (env && typeof env.prod != 'undefined') {
		isDevBuild = !env.prod;
	}

	console.log('isDevBuild: ', isDevBuild);

	return [
		{
			mode: isDevBuild ? 'development': 'production',
			resolve: {
				alias: {
					
					//"signalr": "signalr/jquery.signalR.js",

					'bootstrap-css': 'bootstrap/dist/css/bootstrap.css',
					'font-awesome-css': 'font-awesome/css/font-awesome.css',
					
				}
			},
			entry: {
				start: [
					'./wwwroot/js/start.js',
					//"signalr",
				],
			},
			devtool: '',
			module: {
				
			},
			output: {
				path: path.join(__dirname, 'wwwroot', 'dist'),
				filename: '[name].bundle.js',
				library: '[name]_[hash]'
			},
			plugins: [
				new HardSourceWebpackPlugin({
					configHash: function (webpackConfig) {
						return require('node-object-hash')({ sort: false }).hash(webpackConfig);
					}
				}),
				new webpack.DefinePlugin({
					'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
				}),
				new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru/),
				//new webpack.DllReferencePlugin({
				//	context: __dirname,
				//	manifest: require('./wwwroot/dist/libs-manifest.json')
				//}),
			]
		}
	];
};
