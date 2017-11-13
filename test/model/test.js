module.exports = (app) => {
  const mongoose = app.service('Mongoose');
  const Plugin = app.service('Plugin');
  const { Schema } = mongoose;
  const { ObjectId } = mongoose.Schema.Types;

  const schema = new Schema({
    name: { type: String },
    email: { type: String, unique: true },
    test: { type: ObjectId, ref: 'test' },
  });

  Plugin.plugins(schema);
  return mongoose.model('test', schema);
};
