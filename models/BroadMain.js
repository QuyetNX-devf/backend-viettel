const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BroadMainChema = new Schema({
  CatIdOrder: [
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

module.exports = mongoose.model('broadmain', BroadMainChema);
