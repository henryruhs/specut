import { expect } from 'chai';

import { Option, Helper } from '../src';

describe('option', () =>
{
	let option : Option;

	beforeEach(() =>
	{
		option = new Option(new Helper());
	});

	it('init', () =>
	{
		expect(option.get('path')).to.equal('.');
		expect(option.get('config')).to.equal('.specutrc');
		expect(option.get('amount')).to.equal(5);
		option.init(
		{
			path: 'tests/provider',
			config: 'tests/provider/.specutrc'
		});
		expect(option.get('path')).to.equal('tests/provider');
		expect(option.get('config')).to.equal('tests/provider/.specutrc');
		expect(option.get('amount')).to.equal(10);
	});

	it('get and set', () =>
	{
		expect(option.get('amount')).to.equal(5);
		option.set('amount', 10);
		expect(option.get('amount')).to.equal(10);
	});

	it('clear', () =>
	{
		option.clear();
		expect(option.get('config')).to.be.null;
	});
});
