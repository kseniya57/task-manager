export default {
  app: {
    name: 'TaskManager',
    short_description:
      'удобный и умный инструмент для управления вашими задачами',
    description: 'This is a description'
     // 'Наш инструмент поможет вам организовать свою работу, выполнять все во время. Поможет найти лучших исполнителей для ваших задач. Напомнит вам о ваших планах. И это не все преимущества, которые вам дает этот инструмент. Заходите и наслаждайтесь вашей работой:)'
  },
  menu: {
    home: 'главная',
    schedule: 'расписание',
    projects: 'проекты',
    statistics: 'статистика',
    activity: 'активность',
    teams: 'команды',
    chat: 'чат',
    todos: 'Дела',

    // Project
    tasks: 'Задачи',
    files: 'Файлы',
    members: 'Участники',
    attachments: 'Вложения',
    settings: 'Настройки',
    apps: 'Приложения',
    design: 'Дизайн',
    development: 'Разработка',
    seo: 'SEO, Тексты',
    management: 'Управление'
  },
  actions: {
    upload: 'Загрузить новую',
    delete: 'Удалить',
    change_miniature: 'Изменить миниатюру',
    add: 'Добавить',
    new: 'Новый',
    edit: 'Редактировать',
    change: 'Изменить',
    send: 'Отправить',
    cancel: 'Отмена',
    ok: 'Ок'
  },
  editor: {
    no_description: 'Нет описания',
    no_tags: 'Нет тегов',
    format_bold: 'Жирный',
    format_italic: 'Курсив',
    format_quote: 'Цитата',
    code: 'Код',
    file: 'Файл',
    check_box: 'Задача',
    list: 'Список',
    table_chart: 'Таблица',
    insert_link: 'Ссылка',
    insert_emoticon: 'Смайлик'
  },
  week: {
    sunday: 'Воскресенье',
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пяница',
    saturday: 'Суббота'
  },
  theme: {
    /* colors */
    base: 'Базовый',
    accent: 'Акцентный',
    primary: 'Первый',
    secondary: 'Второй',
    dark: 'Темный',
    white: 'Светлый',
    gray: 'Серый',
    error: 'Ошибка',
    info: 'Инфо',
    success: 'Успех',
    warning: 'Предупреждение',
    text_light: 'Светлый текст',
    text_base: 'Базовый текст',
    text_dark: 'Темный текст',
    /* fonts */
    fonts: 'Шрифты',
    headers: 'Заголовки',
    inputs: 'Поля ввода',
    /* highlight */
    highlight: 'Выделение',
    code: 'Код',
    file: 'Файл',
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
    closed: 'Закрыта',
    opened: 'Открыта'
  },
  filters: {
    creator: 'Создатель',
    assigned_to: 'Исполнитель',
    author: 'Автор',
    active: 'Статус',
    tags: 'Тег',
    users: 'Пользователь'
  },
  sort: {
    updated_at_desc: 'Обновление: (новые => старые)',
    created_at_desc: 'Создание: (новые => старые)',
    created_at_asc: 'Создание: (старые => новые)',
    updated_at_asc: 'Обновление: (старые => новые)',
    likes: 'Популярность'
  },
  form: {
    name: 'Имя',
    email: 'E-Mail',
    password: 'Пароль',
    password_confirmation: 'Подтверждение пароля',
    title: 'Название',
    assigne: 'Исполнитель',
    description: 'Описание',
    search: 'Поиск',
    status: 'Ваш статус',
    bio: 'О себе',
    profession: 'Профессия',
    tags: 'Tags'
  },
  auth: {
    no_account: 'Еще нет аккаунта? Регистрация',
    have_account: 'Уже есть акаунт? Вход',
    login: 'Вход',
    register: 'Регистрация'
  },
  charts: {
    activity: 'Активность'
  },
  events: {
    types: {
      add: 'Добавлено',
      update: 'Обновлено',
      delete: 'Удалено',
      comment: 'Комментарии'
    },
    objects: {
      project: 'Проекты',
      task: 'Задачи',
      todo: 'Задания',
      comment: 'Комментарии',
      user: 'Пользователи',
      team: 'Команды',
      tag: 'Теги'
    }
  },
  chat: {
    type: 'Введите ваше сообщение здесь'
  },
  git: {
    license: 'Нет лицензии. Все права защищены.',
    clone: 'Клонировать',
    fork: 'Форкнуть',
    star: 'Оценить',
    commits: 'коммитов',
    tags: 'тегов',
    branches: 'веток',
    files: 'файлов',
    history: 'История',
    download: 'Скачать',
    instructions: {
      empty_repository: 'Ваш репозиторий пуст.',
      create: 'Создайте новую директрию',
      existing: 'Существующая директория',
      existing_repository: 'Существующий Git репозиторий'
    }
  },
  timer: {
    stop: 'Остановить',
    start: 'Запустить',
    continue: 'Продолжить'
  }
};
