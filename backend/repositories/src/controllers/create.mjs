import path from 'path';
import { REPOSITORIES_ROOT } from '../constants';
import exec from '../utils/cp';
import formRelativePath from "../utils/formRelativePath";

export default async (ctx) => {
  const { name, projectId } = ctx.params;
  const relativePath = formRelativePath(projectId, name);
  const pathToDirectory = path.resolve(REPOSITORIES_ROOT, relativePath);
  await exec(`mkdir -p ${pathToDirectory} && cd ${pathToDirectory} && git init && mv .git ../${name}.git && cd .. && rm -rf ${name} && cd ${name}.git && git config --bool core.bare true`);
  ctx.body = { error: false };
};
