const mongoose = require('mongoose');
const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const CatData = require('../models/CategoryData');
const PackageData = require('../models/PackageData');
const BoardMain = require('../models/BoardMain');
var ObjectId = require('mongodb').ObjectId;

router.put('/swap-data-package', verifyToken, async (req, res) => {
    const { idColumnCat, idPackageDAta, removedIndex, addedIndex, listPackageData } = req.body;
    try {
        const columnCat = await CatData.findOne({ _id: idColumnCat });
        const packageData = await PackageData.findOne({ _id: idPackageDAta });
        if (!columnCat || !packageData) {
            return res.status(404).json({ success: false });
        }
        if (addedIndex != null) {
            await PackageData.updateOne(
                { _id: idPackageDAta },
                {
                    $set: { cat: idColumnCat },
                }
            );
        }

        await CatData.updateOne(
            {
                _id: new ObjectId(idColumnCat),
            },
            {
                $set: {
                    packageOrder: listPackageData,
                    pakageDatas: listPackageData,
                },
            }
        );
        res.json({ success: true, message: 'ok' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'error server' });
    }
});

router.put('/swap-column-cat', verifyToken, async (req, res) => {
    const { idColumnCat, removedIndex, addedIndex, listCatOrder } = req.body;
    try {
        const isCat = CatData.findOne({ _id: idColumnCat });
        if (!isCat) {
            return res.status(404).json({ success: false, message: 'cat not found' });
        }

        await BoardMain.updateOne(
            {},
            {
                $set: {
                    CatIdOrder: listCatOrder,
                    Categorys: listCatOrder,
                },
            }
        );

        res.json({ success: true, message: 'ok' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'error server' });
    }
});

module.exports = router;
