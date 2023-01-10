export interface Metadata
{
	name : string;
	version : string;
}

export interface File
{
	filePath : string;
	sizes :
	{
		it : number;
		describe : number;
	};
}

export interface Data
{
	files : File[];
	sizes :
	{
		file : number;
		it : number;
		describe : number;
	};
}

export interface Chunk
{
	filePath : string;
	chunkPath : string;
}
