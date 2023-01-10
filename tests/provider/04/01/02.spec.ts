import { expect } from 'chai';

describe('01', () =>
{
	it('01', () =>
	{
		expect('it').to.equal('it');
	});

	describe('02', () =>
	{
		it('02', () =>
		{
			expect('describe').to.equal('describe');
		});
	});
});
