import path from 'path';
import { REPOSITORIES_ROOT } from '../constants';
import exec from '../utils/cp';
import commit from "../utils/commit";
import formRelativePath from "../utils/formRelativePath";

export default async (ctx) => {
  const { path: filePath, name, projectId } = ctx.params;
  const lastIndexOfSlash = path.lastIndexOf('/');
  const relativePath = formRelativePath(projectId, name, filePath);
  // TODO: It might not be needed, I'll decide it later
  await exec(`mkdir -p ${path.resolve(REPOSITORIES_ROOT, relativePath.substring(0, lastIndexOfSlash))}`);
  // ***
  await exec(`touch ${path.resolve(REPOSITORIES_ROOT, relativePath)}`);
  await commit(`${name}/${projectId}`, `- added file ${filePath.substring(lastIndexOfSlash + 1)}`);
  ctx.body = { error: false };
};
