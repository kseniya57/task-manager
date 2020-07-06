import fs from 'fs';
import util from 'util';

fs.lstat = util.promisify(fs.lstat);
fs.readdir = util.promisify(fs.readdir);
fs.readFile = util.promisify(fs.readFile);
fs.writeFile = util.promisify(fs.writeFile);
fs.unlink = util.promisify(fs.unlink);

export default fs;
