import fs from 'fs';
import util from 'util';

fs.stat = util.promisify(fs.stat);
fs.readFile = util.promisify(fs.readFile);
fs.mkdir = util.promisify(fs.mkdir);
fs.unlink = util.promisify(fs.unlink);

export default fs;
