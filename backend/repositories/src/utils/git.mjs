import path from 'path';
import exec from './cp';
import { REPOSITORIES_ROOT } from '../constants';

export default repository => async command => exec(
  `cd ${path.resolve(REPOSITORIES_ROOT, repository)} && git ${command}`,
).then(result => result && result.replace(/^[\t\n\s]|[\t\n\s]$/g, ''));
