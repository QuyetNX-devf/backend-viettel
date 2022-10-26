const mongoose = require('mongoose');
const express = require('express');
const argon2 = require('argon2');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const router = express.Router();
const verifyToken = require('../middleware/auth');
var ObjectId = require('mongodb').ObjectId;

const PackageData = require('../models/PackageData');
const CatData = require('../models/CategoryData');
const { findOne } = require('../models/CategoryData');

//@router POST api/auth/dataPackage
//@access Private

router.post('/', verifyToken, async (req, res) => {
    const {
        packageName,
        price,
        periodTime,
        goodwill,
        employeePhone,
        switchboardPhone,
        cancelRenewal,
        cancelPackage,
        img,
        cat,
    } = req.body;
    if (!packageName) {
        return res.status(400).json({ success: false, message: 'Missing name package' });
    }
    try {
        const namePackage = await PackageData.findOne({ packageName: packageName });

        if (namePackage)
            return res
                .status(400)
                .json({ success: false, message: 'Tên gói cước đã được sử dụng' });

        const newPackageData = new PackageData({
            _id: new mongoose.Types.ObjectId(),
            packageName,
            price,
            periodTime,
            goodwill,
            employeePhone,
            switchboardPhone,
            cancelRenewal,
            cancelPackage,
            img,
            cat,
        });

        await newPackageData.save(async (err) => {
            if (err) console.log(err);
            if (cat) {
                await CatData.updateOne(
                    {
                        _id: new ObjectId(cat),
                    },
                    {
                        $push: {
                            packageOrder: newPackageData._id,
                            pakageDatas: newPackageData._id,
                        },
                    }
                );
            }
        });

        res.json({
            success: true,
            message: 'directory created successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server error ...' });
    }
});

router.put('/', verifyToken, async (req, res) => {
    const {
        idPackage,
        packageName,
        price,
        periodTime,
        goodwill,
        employeePhone,
        switchboardPhone,
        cancelRenewal,
        cancelPackage,
        img,
        cat,
    } = req.body;

    try {
        const isPackage = await PackageData.findOne({ _id: idPackage });
        if (!isPackage)
            return res.status(400).json({ success: false, message: 'not found package' });

        if (isPackage.cat) {
            await CatData.updateOne(
                { _id: isPackage.cat },
                {
                    $pullAll: {
                        packageOrder: [idPackage],
                        pakageDatas: [idPackage],
                    },
                }
            );
        }

        let newUpdate = {
            packageName: packageName || isPackage.packageName,
            price: price || isPackage.price,
            periodTime: periodTime || isPackage.periodTime,
            goodwill: goodwill || isPackage.goodwill,
            employeePhone: employeePhone || isPackage.employeePhone,
            switchboardPhone: switchboardPhone || isPackage.switchboardPhone,
            cancelRenewal: cancelRenewal || isPackage.cancelRenewal,
            cancelPackage: cancelPackage || isPackage.cancelPackage,
            img: img || isPackage.img,
            cat: cat || isPackage.cat,
        };

        if (cat) {
            await CatData.updateOne(
                {
                    _id: new ObjectId(cat),
                },
                {
                    $push: {
                        packageOrder: isPackage._id,
                        pakageDatas: isPackage._id,
                    },
                }
            );
        }
        const packageDataUpdate = await PackageData.findOneAndUpdate(
            { _id: new ObjectId(idPackage) },
            newUpdate
        );
        if (!packageDataUpdate)
            return res.status(400).json({ success: false, message: 'not found package' });

        res.json({ success: true, message: 'Update successfulsss' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'err server...' });
    }
});

//@router GEt api/auth/dataPackage
//@access Public

router.get('/', async (req, res) => {
    var myregexp = /^[0-9a-fA-F]{24}$/;
    const params = req.query;
    const { swap } = req.body;
    const { limit = 10, categoryId, page = 1, packageId } = params;

    try {
        let listPackage = await PackageData.find().populate({
            path: 'cat',
        });

        // has categoryId
        if (categoryId) {
            if (!myregexp.test(categoryId)) {
                return res.status(404).json({ success: false, message: 'nodfound...' });
            }
            const packageOrder = (await CatData.findOne({ _id: new ObjectId(categoryId) }))
                .packageOrder;

            listPackage = _.filter(listPackage, {
                cat: { _id: new ObjectId(categoryId) },
            });

            if (!listPackage) {
                return res.status(404).json({
                    success: false,
                    message: 'The page you are looking for has been changed or is not available...',
                });
            }

            listPackage.sort((a, b) => packageOrder.indexOf(a._id) - packageOrder.indexOf(b._id));
        }

        //has packageId
        if (packageId) {
            // console.log(myregexp.test(packageId));
            if (!myregexp.test(packageId)) {
                return res.status(404).json({ success: false, message: 'nodfound...' });
            }

            listPackage = _.filter(listPackage, {
                _id: new ObjectId(packageId),
            });
        }

        const totalRows = listPackage.length;

        const start = (page - 1) * limit;

        const end = page * limit;

        const newPackages = listPackage.slice(start, end);

        res.json({
            success: true,
            packageData: newPackages,
            pagination: {
                total: totalRows,
                page,
                limit,
            },
        });
    } catch (error) {
        console.log(error);
    }
});

// @router DETELE api/packageData
// @desc detele packageData
// @access Private
router.delete('/:id', verifyToken, async (req, res) => {
    var myregexp = /^[0-9a-fA-F]{24}$/;
    const idPackage = req.params.id;
    if (!myregexp.test(idPackage)) {
        return res.status(404).json({ success: false, message: 'nodfound...' });
    }

    try {
        const isPackage = await PackageData.findOne({ _id: idPackage });
        if (!isPackage) {
            return res.status(404).json({ success: false, message: 'package nodfound...' });
        }

        await PackageData.deleteOne({
            _id: idPackage,
        });

        await CatData.updateOne(
            { _id: isPackage.cat },
            {
                $pullAll: {
                    packageOrder: [idPackage],
                    pakageDatas: [idPackage],
                },
            }
        );

        res.json({ success: true, message: 'delete successfulsss' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'internal server error' });
    }
});

module.exports = router;
