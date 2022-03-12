const buildFiles = require('./build.files');
const path = require('path');
const { build, buildSync } = require('esbuild');

var isDev = true;
if (process.argv[2] == '--prod') isDev = false;

function buildLoop(entry, output, loader) {
	let options = {
		entryPoints: [entry],
		bundle: true,
		minify: false,
		minifyWhitespace: false,
		minifySyntax: false,
		minifyIdentifiers: false,
		sourcemap: false,
		color: true,
		platform: 'browser',
		target: ['chrome56', 'firefox57', 'edge16'],
		watch: {
			onRebuild: (error, result) => {
				if (!error) console.log(`✔️ Rebuilt Sucessfully.`);
			}
		},
		outfile: output,
	}

	if (loader) options["loader"] = loader;
	if (!isDev) {
		options['minify'] = true
		options['minifyWhitespace'] = true
		options['minifySyntax'] = true
		options['minifyIdentifiers'] = true
		options['treeShaking'] = true
		delete options['watch'];
	}

	if (isDev) {
		return build(options)
	} else {
		return buildSync(options);
	}
}

if (!isDev) console.time(`time`);

for (let fileIndex = 0; fileIndex < buildFiles.length; fileIndex++) {
	let file = buildFiles[fileIndex];
    console.log(`Building: ${path.basename(file.src)}`);
	buildLoop(file.src, file.out, file.loaders);
}

if (!isDev) console.timeEnd(`time`);
else console.log(`Watching Files.`);