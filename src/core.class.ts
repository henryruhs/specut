import { EOL } from 'os';
import fs from 'fs';
import PATH, { dirname, basename } from 'path';
import glob from 'glob';
import { program } from 'commander';
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
		this.cut(this.analyse())
			.map(chunk => fs.cpSync(chunk.filePath, chunk.chunkPath))
			.map(() => this.stream.write('.'));
		this.stream.write(EOL);
	}

	cli(process : NodeJS.Process) : void
	{
		program
			.version(this.metadataObject.name + ' ' + this.metadataObject.version)
			.option('-C, --config <config>')
			.option('-A, --amount <amount>')
			.option('-M, --mode <mode>')
			.option('-P, --path <path>')
			.parse(process.argv);

		this.option.init(
		{
			config: program.getOptionValue('config'),
			amount: program.getOptionValue('amount'),
			mode: program.getOptionValue('mode'),
			path: program.getOptionValue('path')
		});
		this.init();
	}

	analyse() : Data
	{
		const { specPattern, path } : Options = this.option.getAll();
		const data : Data =
		{
			files: [],
			sizes:
			{
				file: 0,
				it: 0,
				describe: 0
			}
		};

		glob.sync(PATH.join(path, specPattern)).map(filePath =>
		{
			const fileContent : string = fs.readFileSync(filePath, 'utf8');

			data.sizes.file++;
			data.files.push(
			{
				filePath,
				sizes:
				{
					it: (() =>
					{
						const size : number = fileContent.match(/it\(/g)?.length || 0;

						data.sizes.it += size;
						return size;
					})(),
					describe: (() =>
					{
						const size : number = fileContent.match(/describe\(/g)?.length || 0;

						data.sizes.describe += size;
						return size;
					})()
				}
			});
		});
		return data;
	}

	cut(data : Data) : Chunk[]
	{
		const { mode } : Options = this.option.getAll();
		let currentIndex : number = 0;

		return data.files
			.map((file, index) =>
			{
				if (mode === 'it')
				{
					currentIndex = currentIndex + file.sizes.it;
					return { file, chunkIndex: this.calcChunkIndex(currentIndex, data) };
				}
				else if (mode === 'describe')
				{
					currentIndex = currentIndex + file.sizes.describe;
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
		const { chunkPrefix, chunkSuffix, path } : Options = this.option.getAll();

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

		if (mode === 'it')
		{
			return Math.ceil(data.sizes.it / amount);
		}
		if (mode === 'describe')
		{
			return Math.ceil(data.sizes.describe / amount);
		}
		return Math.ceil(data.sizes.file / amount);
	}
}
