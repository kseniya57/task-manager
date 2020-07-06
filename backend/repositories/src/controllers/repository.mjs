import git from '../utils/git';
import fs from '../utils/fs';
import {REPOSITORIES_ROOT} from '../constants';

export default async (ctx) => {
  const {name, projectId} = ctx.params;
  const repository = await ctx.table.get({name, project_id: projectId});
  const repositoryGit = git(`${projectId}/${name}.git`);
    const currentBranch = await repositoryGit('branch | grep \\* | cut -d \' \' -f2');
    const [
      branches,
      commitsCount,
      tagsCount,
      lastCommit,
      size,
      [files, extensions]
    ] = await Promise.all([
      repositoryGit('branch').then(branchesString => branchesString.split(/\n\s*/)).catch(_ => []),
      repositoryGit(`rev-list --count ${currentBranch}`).catch(_ => 0),
      repositoryGit('tag').then(tagsString => (tagsString || '').split('\n').length).catch(_ => 0),
      repositoryGit('log -1').then((commitString) => {
        if (!commitString) { return null }
        const [_, id, author_email, date, message] = /commit\s([\d\w]+)[\s\S]*Author:[^<]*?<([^>]*?)>[\s\S]*Date:\s+(\w{3}\s\w{3}\s\d{2}\s\d{2}:\d{2}:\d{2}\s\d{4}\s\+\d{4})[\n\s\S]([\w-\d\s]+)/im.exec(commitString);

        return {
          id,
          author_email,
          date,
          message: message.replace(/^[\t\n\s]|[\t\n\s]$/g, ''),
        };
      }).catch(_ => null),
      fs.stat(`${REPOSITORIES_ROOT}/${projectId}/${name}.git`).then(data => data.size),
      repositoryGit('ls-tree --full-tree -r HEAD').then(pathsString => {
        const gitObjects = pathsString.split('\n');
        const files = gitObjects.reduce((map, gitObjectInfo) => {
          const [_, hash, path] = gitObjectInfo.match(/blob\s([\w\d]+)\s+(.+)/);
          const pathParts = path.split('/');
          let localMap = map;
          pathParts.forEach((value, index) => {
            if (index === pathParts.length - 1) {
              const indexOfLastDot = value.lastIndexOf('.');
              localMap[value] = {
                name: value.substring(0, indexOfLastDot),
                ext: value.substring(indexOfLastDot + 1),
                hash
              }
            } else {
              if (!localMap[value]) {
                localMap[value] = {};
              }
              localMap = localMap[value];
            }
          });
          return map;
        }, {});
        const onePercent = gitObjects.length / 100;
        const extensions = Object.entries(gitObjects
          .reduce((map, path) => {
            const ext = path.substring(path.lastIndexOf('.') + 1);
            map[ext] = (map[ext] || 0) + 1;
            return map;
          }, {})).reduce((map, [key, value]) => Object.assign(map, {[key]: value / onePercent}), {});
        return [files, extensions]
      }).catch(_ => [{}, {}])
    ]);
    ctx.body = {
      ...repository,
      name,
      branches,
      commitsCount,
      currentBranch,
      tagsCount,
      size,
      files,
      extensions,
      // stars,
      // forks,
      lastCommit,
    };
};
