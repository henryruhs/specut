import { expect } from 'chai';
import { Core, Option, Helper } from '../src';

describe('core', () =>
{
	let helper : Helper;
	let option : Option;
	let core : Core;

	beforeEach(() =>
	{
		helper = new Helper();
		option = new Option(helper);
		core = new Core(helper, option);
	});

	describe('analyse', () =>
	{
		it('empty file', () =>
		{
			option.set('path', 'tests/provider/01');

			expect(core.analyse().sizes).to.eql(
			{
				file: 1,
				it: 0,
				describe: 0
			});
			expect(core.analyse().files).to.eql(
			[
				{
					filePath: 'tests/provider/01/01.spec.ts',
					sizes:
					{
						it: 0,
						describe: 0
					}
				}
			]);
		});

		it('multiple it', () =>
		{
			option.set('path', 'tests/provider/02');
			expect(core.analyse().sizes).to.eql(
			{
				file: 1,
				it: 2,
				describe: 0
			});
			expect(core.analyse().files).to.eql(
			[
				{
					filePath: 'tests/provider/02/01.spec.ts',
					sizes:
					{
						it: 2,
						describe: 0
					}
				}
			]);
		});

		it('multiple describe', () =>
		{
			option.set('path', 'tests/provider/03');
			expect(core.analyse().sizes).to.eql(
			{
				file: 1,
				it: 3,
				describe: 2
			});
			expect(core.analyse().files).to.eql(
			[
				{
					filePath: 'tests/provider/03/01.spec.ts',
					sizes:
					{
						it: 3,
						describe: 2
					}
				}
			]);
		});

		it('multiple files', () =>
		{
			option.set('path', 'tests/provider/04');
			expect(core.analyse().sizes).to.eql(
			{
				file: 6,
				it: 10,
				describe: 8
			});
			expect(core.analyse().files).to.eql(
			[
				{
					filePath: 'tests/provider/04/01.spec.ts',
					sizes:
					{
						describe: 2,
						it: 3
					}
				},
				{
					filePath: 'tests/provider/04/02.spec.ts',
					sizes:
					{
						describe: 2,
						it: 2
					}
				},
				{
					filePath: 'tests/provider/04/03.spec.ts',
					sizes:
					{
						describe: 0,
						it: 0
					}
				},
				{
					filePath: 'tests/provider/04/01/01.spec.ts',
					sizes:
					{
						describe: 2,
						it: 3
					}
				},
				{
					filePath: 'tests/provider/04/01/02.spec.ts',
					sizes:
					{
						describe: 2,
						it: 2
					}
				},
				{
					filePath: 'tests/provider/04/01/03.spec.ts',
					sizes:
					{
						describe: 0,
						it: 0
					}
				}
			]);
		});
	});

	describe('cut', () =>
	{
		it('per file', () =>
		{
			option.set('amount', 2);
			option.set('path', 'tests/provider');
			expect(core.cut(core.analyse()).filter(chunk => chunk.chunkPath.startsWith('tests/__provider__0'))).to.have.length(5);
			expect(core.cut(core.analyse()).filter(chunk => chunk.chunkPath.startsWith('tests/__provider__1'))).to.have.length(4);
		});

		it('per it', () =>
		{
			option.set('amount', 2);
			option.set('mode', 'it');
			option.set('path', 'tests/provider');
			expect(core.cut(core.analyse()).filter(chunk => chunk.chunkPath.startsWith('tests/__provider__0'))).to.have.length(3);
			expect(core.cut(core.analyse()).filter(chunk => chunk.chunkPath.startsWith('tests/__provider__1'))).to.have.length(6);
		});

		it('per describe', () =>
		{
			option.set('amount', 2);
			option.set('mode', 'describe');
			option.set('path', 'tests/provider');
			expect(core.cut(core.analyse()).filter(chunk => chunk.chunkPath.startsWith('tests/__provider__0'))).to.have.length(4);
			expect(core.cut(core.analyse()).filter(chunk => chunk.chunkPath.startsWith('tests/__provider__1'))).to.have.length(5);
		});
	});
});
