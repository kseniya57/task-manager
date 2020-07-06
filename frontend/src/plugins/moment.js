import moment from 'moment';

const dateFormatter = {
  format: date => moment(date).format('DD.MM.YYYY'),
  fromNow: date => moment(date).fromNow()
};

dateFormatter.install = Vue => (Vue.prototype.$dateFormatter = dateFormatter);

export default dateFormatter;
