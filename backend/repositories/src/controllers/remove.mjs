import fs from '../utils/fs';
import {REPOSITORIES_ROOT} from "../constants";
import commit from "../utils/commit";
import formRelativePath from "../utils/formRelativePath";

// TODO: branch
export default async (ctx) => {
  const { projectId, name, path: filePath } = ctx.params;
  const relativePath = formRelativePath(projectId, name, filePath);
  await fs.unlink(path.resolve(REPOSITORIES_ROOT, relativePath));
  if (!['', '/'].includes(path)) {
    commit(`${projectId}/${name}`, `- deleted ${filePath.substring(filePath.lastIndexOf('/') + 1)}`)
  }
  ctx.body = {  error: false };
};
