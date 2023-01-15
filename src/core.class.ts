import { EOL } from 'os';
import fs from 'fs';
import glob from 'fast-glob';
import PATH, { dirname, basename } from 'path';
import { program, Option as CommanderOption } from 'commander';
import { Helper } from './helper.class.js';
import { Option } from './option.class.js';
import { Metadata, File, Data, Chunk } from './core.interface.js';
import { Options } from './option.interface';

export class Core
{
	protected metadataObject : Metadata = this.helper.readJsonFromAbsolutePath('./assets/metadata.json') as Metadata;
	protected stream : NodeJS.WriteStream = process.stdout;

	constructor(
		protected helper : Helper,
		protected option : Option
	)
	{
	}

	init() : void
	{
		const chunks : Chunk[] = this.cut(this.analyse());

		chunks.map(chunk => fs.cpSync(chunk.filePath, chunk.chunkPath)).map(() => this.stream.write('.'));
		if (chunks.length)
		{
			this.stream.write(EOL);
		}
	}

	cli(process : NodeJS.Process) : void
	{
		const { modeArray } : Options = this.option.getAll();

		program
			.argument('[path]')
			.option('-c, --config <config>')
			.option('-a, --amount <amount>')
			.addOption(new CommanderOption('-m, --mode <mode>').choices(modeArray))
			.version(this.metadataObject.name + ' ' + this.metadataObject.version, '-v, --version')
			.action(path =>
			{
				this.option.init(
				{
					path,
					config: program.getOptionValue('config'),
					amount: program.getOptionValue('amount'),
					mode: program.getOptionValue('mode')
				});
				this.init();
			})
			.parse(process.argv);
	}

	analyse() : Data
	{
		const { path, specPattern, ignorePattern, describeMatch, itMatch } : Options = this.option.getAll();
		const data : Data =
		{
			files: [],
			sizes:
			{
				file: 0,
				describe: 0,
				it: 0
			}
		};

		glob.sync(PATH.join(path, specPattern), { ignore: [ ignorePattern ] }).map(filePath =>
		{
			const fileContent : string = fs.readFileSync(filePath, 'utf8');

			data.sizes.file++;
			data.files.push(
			{
				filePath,
				sizes:
				{
					describe: (() =>
					{
						const match : RegExp = new RegExp(describeMatch, 'g');
						const size : number = fileContent.match(match)?.length || 0;

						data.sizes.describe += size;
						return size;
					})(),
					it: (() =>
					{
						const match : RegExp = new RegExp(itMatch, 'g');
						const size : number = fileContent.match(match)?.length || 0;

						data.sizes.it += size;
						return size;
					})()
				}
			});
		});
		return data;
	}

	cut(data : Data) : Chunk[]
	{
		const { mode, modeArray } : Options = this.option.getAll();
		let currentIndex : number = 0;

		return data.files
			.filter(value => modeArray.includes(mode) ? value : null)
			.map((file, index) =>
			{
				if (mode === 'describe')
				{
					currentIndex = currentIndex + file.sizes.describe;
					return { file, chunkIndex: this.calcChunkIndex(currentIndex, data) };
				}
				if (mode === 'it')
				{
					currentIndex = currentIndex + file.sizes.it;
					return { file, chunkIndex: this.calcChunkIndex(currentIndex, data) };
				}
				return { file, chunkIndex: this.calcChunkIndex(index, data) };
			})
			.map(({ file, chunkIndex } : { file : File, chunkIndex : number }) =>
			{
				return { filePath: file.filePath, chunkPath: this.buildChunkPath(file.filePath, chunkIndex) };
			});
	}

	protected buildChunkPath(filePath : string, chunkIndex : number) : string
	{
		const { path, chunkPrefix, chunkSuffix } : Options = this.option.getAll();

		return PATH.join(
			dirname(path),
			chunkPrefix + basename(path) + chunkSuffix + chunkIndex,
			filePath.replace(path, '')
		);
	}

	protected calcChunkIndex(currentIndex : number, data : Data) : number
	{
		const { amount } : Options = this.option.getAll();
		const chunkIndex : number = Math.floor(currentIndex / this.perChunk(data));

		return chunkIndex < amount ? chunkIndex : amount - 1;
	}

	protected perChunk(data : Data) : number
	{
		const { amount, mode } : Options = this.option.getAll();

		if (mode === 'describe')
		{
			return Math.ceil(data.sizes.describe / amount);
		}
		if (mode === 'it')
		{
			return Math.ceil(data.sizes.it / amount);
		}
		return Math.ceil(data.sizes.file / amount);
	}
}
