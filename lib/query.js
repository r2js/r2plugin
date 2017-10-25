module.exports = (app, query, schema) => {
  if (query) {
    const { plugin } = app.service('Query');
    schema.plugin(plugin);
  }
};
