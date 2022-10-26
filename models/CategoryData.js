const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoryDataPackageSchema = new Schema({
  nameCatPackge: {
    type: String,
    required: true,
  },
  packageOrder: [{ type: Schema.Types.ObjectId }],
  pakageDatas: [{ type: Schema.Types.ObjectId, ref: 'packagedata' }],
});

module.exports = mongoose.model(
  'categorydatapackages',
  CategoryDataPackageSchema
);
