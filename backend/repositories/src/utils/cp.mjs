import cp from 'child_process';
import util from 'util';

cp.exec = util.promisify(cp.exec);

export default async (command) => {
    const { stdout, stderr } = await cp.exec(command.replace('\n',''));

    if (stderr) {
      throw new Error(stderr);
    }

    return stdout;
};
