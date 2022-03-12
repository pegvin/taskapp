const path = require("path");

module.exports = [
    {
		src: path.join(__dirname, './src/index.js'),
		out: path.join(__dirname, './www/build/bundle.js'),
		loaders: null
	},
    {
		src: path.join(__dirname, './styles/index.css'),
		out: path.join(__dirname, './www/build/bundle.css'),
		loaders: {
			'.png': 'file',
			'.ttf': 'file'
		},
	}
]