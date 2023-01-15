import { Mode } from './option.type';

export interface Options
{
	config : string;
	amount : number;
	mode : Mode;
	modeArray : Mode[];
	specPattern : string;
	ignorePattern : string;
	describeMatch : string;
	itMatch : string;
	chunkPrefix : string,
	chunkSuffix : string;
	path : string;
}
