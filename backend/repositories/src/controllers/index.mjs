import { controller } from 'base';

import repository from './repository';
import read from './file';
import create from './create';
import commits from './commits';
import branches from './branches';
import tags from './tags';
import mrs from './mrs';
import mr from './mr';
import updateFile from "./updateFile";
import createFile from "./createFile";
import remove from "./remove";
import download from './download';

controller.addRoute('post', '/create', create);
controller.addRoute('post', '/file/read', read);
controller.addRoute('post', '/file/create', createFile);
controller.addRoute('post', '/file/update', updateFile);
controller.addRoute('post', '/remove', remove);
controller.addRoute('post', '/repository', repository);
controller.addRoute('post', '/commits', commits);
controller.addRoute('post', '/branches', branches);
controller.addRoute('post', '/tags', tags);
controller.addRoute('post', '/mrs', mrs);
controller.addRoute('post', '/mrs', mr);
controller.addRoute('post', '/download', download);
