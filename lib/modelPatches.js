module.exports = (app, modelPatches, schema) => {
  const mongoose = app.service('Mongoose');
  const { Mixed } = mongoose.Schema.Types;

  if (modelPatches) {
    schema.plugin((modelSchema) => {
      modelSchema.add({ patch: { type: Number, default: 0 } });
      modelSchema.add({ lastPatches: [{ type: Mixed }] });

      modelSchema.methods.applyPatch = function (options = {}) { // eslint-disable-line
        const { limit = 1 } = options;

        return Promise.all([
          this.patches.count({ ref: this.id }),
          this.patches.find({ ref: this.id }).sort({ date: -1 }).limit(limit),
        ])
          .then((data) => {
            const [patch, lastPatches] = data;
            return this.update({ patch, lastPatches });
          });
      };
    });
  }
};
