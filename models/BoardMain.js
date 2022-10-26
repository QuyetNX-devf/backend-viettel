const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardMainChema = new Schema({
  title: String,
  CatIdOrder: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  Categorys: [
    {
      type: Schema.Types.ObjectId,
      ref: 'categorydatapackages',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('boardmains', BoardMainChema);
