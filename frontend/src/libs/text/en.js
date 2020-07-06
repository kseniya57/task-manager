export default {
  app: {
    name: 'TaskManager',
    short_description: 'convenient and smart task manager',
    description: 'This is a description'
      //'Our tool will help you organize your work, do everything on time. It will help to find the best performers for your tasks. Remind you of your plans. And these are not all the benefits that this tool gives you. Come and enjoy your work :)'
  },
  menu: {
    home: 'home',
    schedule: 'schedule',
    projects: 'projects',
    statistics: 'statistics',
    activity: 'activity',
    teams: 'teams',
    chat: 'chat',
    todos: 'Todos',

    // Project
    tasks: 'Tasks',
    files: 'Files',
    members: 'Members',
    attachments: 'Attachments',
    settings: 'Settings',
    apps: 'Apps',
    design: 'Design',
    development: 'Development',
    seo: 'SEO, Content',
    management: 'Management'
  },
  actions: {
    upload: 'Upload New',
    delete: 'Delete',
    change_miniature: 'Change Miniature',
    add: 'Add',
    new: 'New',
    edit: 'Edit',
    change: 'Change',
    send: 'Send',
    cancel: 'Cancel',
    ok: 'Ok'
  },
  editor: {
    no_description: 'No description',
    no_tags: 'No tags',
    format_bold: 'Bold',
    format_italic: 'Italic',
    format_quote: 'Quote',
    code: 'Code',
    file: 'File',
    check_box: 'Task',
    list: 'List',
    table_chart: `Table`,
    insert_link: 'Link',
    insert_emoticon: 'Emoji'
  },
  week: {
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday'
  },
  theme: {
    /* colors */
    base: 'Base',
    accent: 'Accent',
    primary: 'Primary',
    secondary: 'Secondary',
    dark: 'Dark',
    white: 'White',
    gray: 'Gray',
    error: 'Error',
    info: 'Info',
    success: 'Success',
    warning: 'Warning',
    text_light: 'Light text',
    text_base: 'Base text',
    text_dark: 'Dark text',
    /* fonts */
    fonts: 'Fonts',
    headers: 'Headers',
    inputs: 'Inputs',
    /* highlight */
    highlight: 'Highlight',
    code: 'Code',
    file: 'File',
    highlightThemes: {
      default: 'Default',
      dark: 'Dark',
      funky: 'Funky',
      okaidia: 'Okaida',
      twilight: 'Twilight',
      coy: 'Coy',
      solarizedlight: 'Solarized Light',
      tomorrownight: 'Tommorow Night'
    }
  },
  status: {
    closed: 'Closed',
    opened: 'Opened'
  },
  filters: {
    creator: 'Creator',
    assigned_to: 'Assigned to',
    author: 'Author',
    active: 'Status',
    tags: 'Tag',
    users: 'User'
  },
  sort: {
    updated_at_desc: 'Updated: (new => old)',
    created_at_desc: 'Created: (new => old)',
    created_at_asc: 'Created: (old => new)',
    updated_at_asc: 'Updated: (old => new)',
    likes: 'Popularity'
  },
  form: {
    name: 'Name',
    email: 'E-Mail',
    password: 'Password',
    password_confirmation: 'Password Confirmation',
    title: 'Title',
    assigne: 'Assigne',
    description: 'Description',
    search: 'Search',
    status: 'Your status',
    bio: 'BIO',
    profession: 'Profession',
    tags: 'Tags'
  },
  auth: {
    no_account: 'Don\'t have an account yet? Register',
    have_account: 'Already have an account? Login',
    login: 'Login',
    register: 'Register'
  },
  charts: {
    activity: 'Activity'
  },
  events: {
    types: {
      add: 'Added',
      update: 'Updated',
      delete: 'Deleted',
      comment: 'Commented'
    },
    objects: {
      project: 'Projects',
      task: 'Tasks',
      todo: 'Todos',
      comment: 'Comments',
      user: 'Users',
      team: 'Teams',
      tag: 'Tags'
    }
  },
  chat: {
    type: 'Type your message here'
  },
  git: {
    license: 'No license. All rights reserved.',
    clone: 'Clone',
    fork: 'Fork',
    star: 'Star',
    commits: 'commits',
    branches: 'branches',
    tags: 'tags',
    files: 'files',
    history: 'History',
    download: 'Download',
    instructions: {
      empty_repository: 'Your repository is empty.',
      create: 'Create a new repository',
      existing: 'Existing folder',
      existing_repository: 'Existing Git repository'
    }
  },
  timer: {
    stop: 'Stop',
    start: 'Start',
    continue: 'Continue'
  }
};
