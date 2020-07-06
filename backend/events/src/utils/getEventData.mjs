import createProxyWithDefaultFallback from './createProxyWithDefaultFallback';
import getObjectsDifference from './getObjectsDifference';

// added you to project
// added you to chat -> ability to define if same action happened => add receiver == null or ids

const getTimeString = (time) => {
  const hours = Math.round((time / 3600) % 3600);
  const minutes = Math.round((time / 60) % 60);
  const seconds = Math.round(time % 60);
  return `${hours ? `${hours}h ` : ''}${minutes ? `${minutes}m ` : ''}${seconds ? `${seconds}s ` : ''}`
};

const updateTaskMap = {
  assigned_to: ({ oldValue, value }) => ({ content: `${oldValue} assigned to ${value}`, type: 'assigne' }),
  active: ({ value }, task) => {
    const [content, type] = value === 1 ? [`closed task ${task.name}`, 'done'] : [`opened task ${task.name}`, 'close'];
    return { content, type }
  },
  name: ({ oldValue, value }) => ({ content: `renamed task ${oldValue} to ${value}}`, type: 'update' }),
  description: ({ oldValue, value }, task) => ({ content: `changed description ${oldValue} -> ${value} on task ${task.name}`, type: 'update' }),
  time: ({ oldValue, value }, task) => ({ content: `spent ${getTimeString(value - oldValue)} on task ${task.name}`, type: 'time' })
};

const templates = createProxyWithDefaultFallback({
  add: createProxyWithDefaultFallback({
    default({ object }) {
      return { content: `added ${object}`, type: 'add' }
    },
    message() {
      return { content: `sended message`, type: 'message' }
    }
  }),
  update: createProxyWithDefaultFallback({
    task(data, oldData) {
      const changesMap = getObjectsDifference(oldData, data);
      return Object.entries(changesMap).reduce((items, [key, value]) => {
        if (updateTaskMap[key]) {
          items.push( updateTaskMap[key](value, data))
        }
        return items;
      }, []);
    },
    project(data, oldData) {

    },
    default({ object }) {
      return { content: `updated ${object}`, type: 'update' }
    },
  }),
  delete: createProxyWithDefaultFallback({
    default({ object }) {
      return { content: `deleted ${object}`, type: 'delete' }
    }
  }),
  default: {

  }
});

export default (type, object, data, oldData) => {
  return templates[type][object](data, oldData);
};

