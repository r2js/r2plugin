const patchHistoryPlugin = require('mongoose-patch-history');

module.exports = (app, patchHistory, schema) => {
  const mongoose = app.service('Mongoose');
  const { Schema } = mongoose;

  if (patchHistory && patchHistory.name) {
    schema.virtual('actor').set(function (actor) {
      this._actor = actor;
    });

    schema.plugin(patchHistoryPlugin.default, {
      mongoose,
      name: `${patchHistory.name}Patches`,
      includes: {
        actor: { type: Schema.Types.ObjectId, from: '_actor' },
      },
    });
  }
};
