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
		describe : number;
		it : number;
	};
}

export interface Data
{
	files : File[];
	sizes :
	{
		file : number;
		describe : number;
		it : number;
	};
}

export interface Chunk
{
	filePath : string;
	chunkPath : string;
}
