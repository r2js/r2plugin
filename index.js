const findOrCreate = require('mongoose-findorcreate');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const softDelete = require('mongoose-delete');
const idValidator = require('mongoose-id-validator');
const paginate = require('mongoose-paginate');
const batchesPlugin = require('mongoose-batches');
const findOrErrorPlugin = require('mongoose-find-or-error');
const handleIdValidator = require('./lib/handleIdValidator');
const handleArrayUniqueValidator = require('./lib/handleArrayUniqueValidator');
const libQuery = require('./lib/query');
const libPatchHistory = require('./lib/patchHistory');
const libModelPatches = require('./lib/modelPatches');

module.exports = function PluginService(app) {
  if (!app.hasServices('Mongoose|Query')) {
    return false;
  }

  const mongoose = app.service('Mongoose');
  const { notFound } = app.handler;

  mongoose.plugin(findOrCreate);
  mongoose.plugin(beautifyUnique);
  mongoose.plugin(softDelete);
  mongoose.plugin(idValidator);
  mongoose.plugin(paginate);
  mongoose.plugin(batchesPlugin);
  mongoose.plugin(findOrErrorPlugin, {
    getFindByIdError: (id, modelName) => notFound(`${modelName}IdNotFound`),
    getFindOneError: (query, modelName) => notFound(`${modelName}NotFound`),
  });

  return {
    plugins(schema, {
      query = true,
      patchHistory = false,
      modelPatches = false,
    } = {}) {
      schema.post('save', handleIdValidator);
      schema.post('save', handleArrayUniqueValidator);

      libQuery(app, query, schema);
      libPatchHistory(app, patchHistory, schema);
      libModelPatches(app, modelPatches, schema);
    },
  };
};
