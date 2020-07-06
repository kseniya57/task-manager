import base64Img from 'base64-img';
import fs from '../utils/fs';
import cp from 'child_process';
import chokidar from 'chokidar';
import util from 'util';

cp.exec = util.promisify(cp.exec);

const watcher = chokidar.watch('data/*.svg', { persistent: true });

watcher.on('add', async sourcePath => {
  try {
    let svg = (await fs.readFile(sourcePath)).toString();

    const fileName = sourcePath.replace(/data\/|\.svg/g, '');

    const destPath = `sketch/${fileName}`;

    await cp.exec(`mkdir -p ${destPath}/images`);

    const imageTags = svg.match(/<image[^>]+?>/ig);

    if (imageTags) {
      // Promise.all not applied here because use variable svg
      for (const imageTag of imageTags) {
        const [_, id, image] = imageTag.match(/id="([^"]+?)".+?xlink:href="([^"]+?)"/);
        base64Img.imgSync(image, `${destPath}/images`, id);
        svg = svg.replace(image, `sketch/${fileName}/images/${id}.png`);
      }
    }

    await fs.writeFile(`${destPath}/template.svg`, svg.replace(/svg width="\d+px" height="\d+px"/, 'svg width="100%" height="100%"'));

    await fs.unlink(sourcePath);

    console.log(`${sourcePath} processed`)
  } catch (e) {
    console.error(e);
  }
});