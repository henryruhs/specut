import { readFileSync, existsSync, PathLike } from 'fs';
import { fileURLToPath } from 'url';
import PATH, { dirname } from 'path';

export class Helper
{
	tidyObject(dirtyObject : object) : object
	{
		return JSON.parse(JSON.stringify(dirtyObject));
	}

	parseJson(content : string) : object
	{
		try
		{
			return JSON.parse(content);
		}
		catch
		{
			return {};
		}
	}

	resolveAbsolutePath(path : string) : PathLike
	{
		return PATH.join(dirname(fileURLToPath(import.meta.url)), path);
	}

	readJson(path : PathLike) : object
	{
		return existsSync(path) ? this.parseJson(readFileSync(path, 'utf-8')) : {};
	}

	readJsonFromAbsolutePath(path : string) : object
	{
		return this.readJson(this.resolveAbsolutePath(path));
	}
}
