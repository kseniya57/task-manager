import {REPOSITORIES_ROOT} from "../constants";
import git from '../utils/git';

export default async ctx => {
  const { name, projectId, hash } = ctx.params;
  const gitRepository = git(REPOSITORIES_ROOT + '/' + projectId + `/${name}.git`);
  ctx.body = { file: await gitRepository(`cat-file -p ${hash}`) }
}