import { controller } from 'base';

import login from './login';
import register from './register';
import check from './check';

controller.addRoute('post', '/register', register);
controller.addRoute('post', '/login', login);
controller.addRoute('post', '/check', check);
