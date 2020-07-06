import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Schedule from '@/views/Schedule';
import {
  Projects,
  Project,
  ProjectTasks,
  ProjectFiles,
  ProjectDesign,
  ProjectDevelopment
} from '@/views/Projects';
import Activity from '@/views/Activity';
import Teams from '@/views/Teams';
import Chat from '@/views/Chat';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: Schedule
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects
    },
    {
      path: '/projects/:id',
      name: 'project',
      component: Project
    },
    {
      path: '/projects/:id/tasks',
      name: 'project_tasks',
      component: ProjectTasks
    },
    // TODO: DELETE IT
    {
      path: '/projects/:id/files',
      name: 'project_files',
      component: ProjectDevelopment
    },
    {
      path: '/projects/:id/design',
      name: 'project_design',
      component: ProjectDesign
    },
    {
      path: '/projects/:id/development',
      name: 'project_development',
      component: ProjectDevelopment
    },
    {
      path: '/projects/:id/repositories/:name',
      name: 'project_repository',
      component: ProjectFiles
    },
    {
      path: '/projects/:id/statistics',
      name: 'project_statistics',
      component: Activity
      //props: { filter: { object: 'project' } } || owner_type: 'project' ...
    },
    {
      path: '/activity',
      name: 'activity',
      component: Activity
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: Activity,
      props: { filter: { user_id: component => component.user.id } }
    },
    {
      path: '/teams',
      name: 'teams',
      component: Teams
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    }
    // {
    //   path: '/statistics',
    //   name: 'statistics',
    //   component:
    // }
  ]
});
