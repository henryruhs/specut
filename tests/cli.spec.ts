import fs from 'fs';
import { expect } from 'chai';
import { exec } from 'child_process';

describe('cli', () =>
{
	it('run main command', done =>
	{
		exec('node --loader ts-node/esm src/cli.ts tests/provider --amount=2', error =>
		{
			console.log(error);
			expect(error).to.be.null;
			expect(fs.readdirSync('tests/__provider__0')).to.be.eql([ '01', '02', '03', '04' ]);
			expect(fs.readdirSync('tests/__provider__1')).to.be.eql([ '04' ]);
			fs.rmSync('tests/__provider__0', { recursive: true, force: true });
			fs.rmSync('tests/__provider__1', { recursive: true, force: true });
			done();
		});
	});

	it('run help command', done =>
	{
		exec('node --loader ts-node/esm src/cli.ts --help', error =>
		{
			expect(error).to.be.null;
			done();
		});
	});

	it('run version command', done =>
	{
		exec('node --loader ts-node/esm src/cli.ts --version', error =>
		{
			expect(error).to.be.null;
			done();
		});
	});
});
