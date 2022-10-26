const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataPackage = new Schema({
    packageName: {
        type: String,
        required: true,
    },
    price: String,
    goodwill: String,
    employeePhone: String,
    switchboardPhone: String,
    cancelRenewal: String,
    cancelPackage: String,
    img: String,
    cat: [
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
const PackageDataSchema = new Schema({
    packageName: {
        type: String,
        required: true,
    },
    price: String,
    periodTime: String,
    goodwill: String,
    employeePhone: String,
    switchboardPhone: String,
    cancelRenewal: String,
    cancelPackage: String,
    img: String,
    cat: {
        type: Schema.Types.ObjectId,
        ref: 'categorydatapackages',
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('packagedata', PackageDataSchema);
