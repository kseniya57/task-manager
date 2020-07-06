import fs from "../utils/fs";
import {REPOSITORIES_ROOT} from "../constants";
import exec from '../utils/cp';

// TODO redo it, now it will be work differently
export default async ctx => {
  const { name, projectId } = ctx.params;
  const pathToDirectory = REPOSITORIES_ROOT + '/' + projectId;
  await exec(`cd ${pathToDirectory} && zip -r ${name}.zip ./${name}`).catch(console.error);
  ctx.response.attachment();
  ctx.body = fs.createReadStream(pathToDirectory + '/' + name + '.zip');
}