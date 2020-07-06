const DEFAULT_IMAGE = 'noImage.png';
import { UPLOADS_URL } from '../constants';

const imagePlugin = {
  getImage(name = DEFAULT_IMAGE, local = false) {
    try {
      return local ? require(`@/assets/images/${name}`) : UPLOADS_URL + name;
    } catch (e) {
      return require(`@/assets/images/${DEFAULT_IMAGE}`);
    }
  }
};

imagePlugin.install = Vue => (Vue.prototype.$getImage = imagePlugin.getImage);

export default imagePlugin;
