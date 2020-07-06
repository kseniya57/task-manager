import path from 'path';
import { REPOSITORIES_ROOT } from '../constants';
import exec from '../utils/cp';
import commit from "../utils/commit";
import formRelativePath from "../utils/formRelativePath";

export default async (ctx) => {
  const { path: filePath, name, projectId, content } = ctx.params;
  const relativePath = formRelativePath(projectId, name, filePath);
  await exec(`echo "${content}" > ${path.resolve(REPOSITORIES_ROOT, relativePath)}`);
  await commit(`${name}/${projectId}`, `- updated ${filePath.substring(filePath.lastIndexOf('/') + 1)}`);
  ctx.body = { error: false };
};