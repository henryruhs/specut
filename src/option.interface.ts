import { Mode } from './option.type';

export interface Options
{
	config : string;
	amount : number;
	mode : Mode;
	specPattern : string;
	chunkPrefix : string,
	chunkSuffix : string;
	path : string;
}
