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
		expect(option.get('config')).to.equal('.specut');
		expect(option.get('amount')).to.equal(5);
		expect(option.get('path')).to.equal('.');
		option.init(
		{
			config: 'tests/provider/.specut',
			path: '..'
		});
		expect(option.get('config')).to.equal('tests/provider/.specut');
		expect(option.get('amount')).to.equal(10);
		expect(option.get('path')).to.equal('..');
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
