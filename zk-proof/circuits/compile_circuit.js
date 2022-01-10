import compile from 'circom'
import argparse from 'argparse';
import fs from 'fs';

const main = async () => {
	const parser = new argparse.ArgumentParser();
	parser.addArgument(['-i', '--input'], {help: '.circom input file'});
	parser.addArgument(['-o', '--output'], {help: '.json output file'});
	const args = parser.parseArgs();

	if (!args.input || !fs.existsSync(args.input)) {
		console.log('Input does not exist');
		return;
	} else if (!args.output) {
		console.log('Please specify an output');
		return;
	}
	try {
		const circuitDef = await compile(args.input);
		fs.writeFileSync(args.output, JSON.stringify(circuitDef), 'utf8');
		console.log('done');
  	} catch(err) {
		console.log(err);
	}
}

main();