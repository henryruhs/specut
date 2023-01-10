import { Core, Helper, Option } from './index.js';

const helper : Helper = new Helper();
const option : Option = new Option(helper);
const core : Core = new Core(helper, option);

core.cli(process);
