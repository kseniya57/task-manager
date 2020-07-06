import toPlural from '@/utils/toPlural';

const addSubscriptions = function(name, queries, filter, addQuery = true) {
  const store = this.$apolloProvider.defaultClient.cache;
  const afterSubscription = data =>
    store.writeQuery({ query: queries.all, data: { [pluralName]: data } });

  const pluralName = toPlural(name);

  if (addQuery) {
    this.$apollo.addSmartQuery(pluralName, queries.all);
  }

  this.$apollo.addSmartSubscription(
    `${name}Added`,
    typeof queries.added === 'function'
      ? queries.added(afterSubscription)
      : {
          query: queries.added,
          result({ data: { [`${name}Added`]: added } }) {
            this[pluralName].push(added);
            afterSubscription(this[pluralName]);
          },
          variables: { filter }
        }
  );
  this.$apollo.addSmartSubscription(`${name}Updated`, {
    query: queries.updated,
    result({ data: { [`${name}Updated`]: updated } }) {
      const old = this[pluralName].find(item => item.id === updated.id);
      if (old) {
        Object.assign(old, updated);
        afterSubscription(this[pluralName]);
      }
    },
    variables: { filter }
  });
  this.$apollo.addSmartSubscription(`${name}Deleted`, {
    query: queries.deleted,
    result({
      data: {
        [`${name}Deleted`]: { id }
      }
    }) {
      const index = this[pluralName].findIndex(item => item.id === id);
      if (index !== -1) {
        this.$delete(this[pluralName], index);
        afterSubscription(this[pluralName]);
      }
    },
    variables: { filter }
  });
};

export default {
  install: Vue => (Vue.prototype.$addSubscriptions = addSubscriptions)
};
