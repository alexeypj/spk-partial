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
			mode: isDevBuild ? 'development' : 'production',
			resolve: {
				alias: {

					//"signalr": "signalr/jquery.signalR.js",
					'bootstrap-css': 'bootstrap/dist/css/bootstrap.css',
					'font-awesome-css': 'font-awesome/css/font-awesome.css',
					//"datatables.net-bs-css": "datatables.net-bs/css/dataTables.bootstrap.css",
					//"eonasdan-bootstrap-datetimepicker-css":
					//"eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
					'select2-ru': 'select2/dist/js/i18n/ru.js',
					'select2-css': 'select2/dist/css/select2.css',
					'select2-bootstrap-theme': 'select2-bootstrap-theme/dist/select2-bootstrap.css',
					//"tether-css": "tether/dist/css/tether.css",
					//"jsoneditor-css": "jsoneditor/dist/jsoneditor.css",
					//"jstree-css": "jstree/dist/themes/default/style.css"

				}
			},
			entry: {
				vendor: [
					'vue',
					'vue-router',
					'bootstrap',
					'vuex',
					'axios',
					'lodash',
					'vee-validate',
					//'jquery',
					//'select2',
					'moment',
					'vue-date-pick',
				]
			},
			devtool: '',
			module: {
			},
			output: {
				path: path.join(__dirname, 'wwwroot', 'dist'),
				filename: '[name].bundle.js',
				library: '[name]_lib'
			},
			plugins: [				
				new HardSourceWebpackPlugin({
					configHash: function (webpackConfig) {
						return require('node-object-hash')({ sort: false }).hash(webpackConfig);
					}
				}),
				new webpack.DllPlugin({
					path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
					name: '[name]_lib'
				}),
				new webpack.DefinePlugin({
					'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
				}),
				new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru/),
				new webpack.optimize.SplitChunksPlugin('libs'),				
			],
		
		}
	];
};