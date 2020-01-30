const path = require('path');
const webpack = require('webpack');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = './wwwroot/dist';
const sources = path.resolve(__dirname, 'AppClient');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
//const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
//const smp = new SpeedMeasurePlugin();
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const appSettings = require('./appsettings.json');
const publicPath = appSettings.Installation.PublicPath;

module.exports = (env) => {
	var isDevBuild = true;	

	if (process.env && process.env.NODE_ENV) {
		if (process.env.NODE_ENV === 'production') {
			isDevBuild = false;
		}
	} else if (env && typeof env.prod!=='undefined') {
		isDevBuild = !env.prod;
	} 

	console.log('isDevBuild: ', isDevBuild);


	return [{
		mode: isDevBuild ? 'development': 'production',
		devServer: {
			contentBase: bundleOutputDir,
			hot: true,
			compress: true,
			open: true
		},
		stats: { modules: false },
        context: __dirname,
		resolve: {
			modules: [
				'node_modules',
				path.resolve(__dirname, 'AppClient')
			],
			extensions: ['.js', '.ts', '.vue'],
			alias: {
				'Vue$': isDevBuild ? 'vue/dist/vue.runtime.js' : 'vue/dist/vue.runtime.min.js',
				'vue-property-decorator': 'vue-property-decorator/lib/vue-property-decorator.js',
				'vuex-class': isDevBuild ? 'vuex-class/dist/vuex-class.js' : 'vuex-class/dist/vuex-class.min.js',
				'@': sources
				//jquery: path.join(__dirname, 'node_modules/jquery/src/jquery')
			}
		},
		entry: {
			'entry': './AppClient/Components/Entry/boot.ts'                    
			//'vuex.store': './AppClient/Store/index.ts',
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					include: [sources],
					exclude: [/node_modules/],
					loader: 'vue-loader',
					options: {
						esModule: true,
						prettify: false
					}
				},
				{
					test: /\.ts$/,
					include: [sources],
					exclude: [/node_modules/],
					loader: 'awesome-typescript-loader',
					options: {
						useCache: true,
						silent: true,
						usePrecompiledFiles: true,
						appendTsSuffixTo: [/\.vue$/],
					}
				},
				{
					test: /\.css$/,
					use: [
						isDevBuild ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
						{ loader: 'css-loader', options: { sourceMap: isDevBuild } },
					]
				},
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
            ]
		},
		devtool: isDevBuild ? 'eval-source-map' : 'source-map',
		output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: '[name].js',
            publicPath: publicPath + 'dist/'
        },
		plugins: [
			new VueLoaderPlugin(),
			new CleanWebpackPlugin({
				root: path.resolve(bundleOutputDir),
				verbose: false,
				cleanOnceBeforeBuildPatterns: ['!*.json'],
			}),
			new HardSourceWebpackPlugin({
				configHash: function (webpackConfig) {
					return require('node-object-hash')({ sort: false }).hash(webpackConfig);
				},
				cachePrune: {
					maxAge: 24 * 60 * 60 * 1000
				}
			}),
			// new BundleAnalyzerPlugin(),
			new CheckerPlugin(),
			
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(isDevBuild ? 'development' : 'production')
                }
			}),
            new webpack.DllReferencePlugin({
				context: __dirname,
				manifest: require(bundleOutputDir + '/vendor-manifest.json')
			}),
			//new webpack.DllReferencePlugin({
			//	context: __dirname,
			//	manifest: require(bundleOutputDir + '/libs-manifest.json')
			//}),
			new webpack.optimize.SplitChunksPlugin(),
			//new BundleAnalyzerPlugin(),
			//new MiniCssExtractPlugin({
			//	filename: '[name].css'
			//})
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [// Plugins that apply in production builds only
			]),

		optimization: {
			splitChunks: {
				chunks: 'async',
				maxInitialRequests: Infinity,
				minSize: 0,
				name: true,
				cacheGroups: {
					vendors: {
						test: /[\\/]node_modules[\\/]/,
						priority: -10
					},
					styles: {
						name: 'styles',
						test: /\.css$/,
						chunks: 'all',
						enforce: true,
					},
					default: {
						minChunks: 2,
						priority: -20,
						reuseExistingChunk: true
					},
					
				}
			},
			minimizer: [new UglifyJsPlugin({
				parallel: true,
				cache: true,
				sourceMap: isDevBuild
			})]
		},
		performance: {
			hints: 'warning'
		},
		externals: {
			jquery: 'jQuery',
			Vue: 'vue'
		}
	}];
};
