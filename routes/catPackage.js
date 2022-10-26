const mongoose = require('mongoose');
const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const CatData = require('../models/CategoryData');
const BroadMain = require('../models/BroadMain');
const BoardMain = require('../models/BoardMain');
var ObjectId = require('mongodb').ObjectId;

//@router POST api/auth/dataPackage
//@access Private

router.post('/', verifyToken, async (req, res) => {
    const { nameCatPackge } = req.body;
    if (!nameCatPackge) {
        return res.status(400).json({ success: false, message: 'Missing name package' });
    }
    try {
        const package = await CatData.findOne({
            nameCatPackge: { $regex: nameCatPackge, $options: 'i' },
        });
        if (package)
            return res.status(400).json({ success: false, message: 'Danh mục đã tồn tại' });

        const newCatData = new CatData({
            _id: new mongoose.Types.ObjectId(),
            nameCatPackge,
        });

        await newCatData.save(async (err) => {
            if (err) console.log(err);
            await BoardMain.updateOne({
                $push: { Categorys: newCatData._id, CatIdOrder: newCatData._id },
            });
        });

        res.json({
            success: true,
            message: 'directory created successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server error' });
    }
});

//@router GEt api/auth/dataPackage
//@access Public

router.get('/', async (req, res) => {
    try {
        let catPackage = await CatData.find();

        const catPackageOrder = (await BoardMain.findOne()).CatIdOrder;

        catPackage.sort((a, b) => catPackageOrder.indexOf(a._id) - catPackageOrder.indexOf(b._id));

        res.json({ success: true, catPackage });
    } catch (error) {
        console.log(error);
    }
});
router.get('/allCat', async (req, res) => {
    try {
        let catPackage = await CatData.find();
        const catPackageOrder = (await BoardMain.findOne()).CatIdOrder;

        catPackage.sort((a, b) => catPackageOrder.indexOf(a._id) - catPackageOrder.indexOf(b._id));

        newCatPackage = catPackage.map((cat) => ({
            _id: cat._id,
            nameCatPackge: cat.nameCatPackge,
        }));

        res.json({ success: true, catPackage: newCatPackage });
    } catch (error) {
        console.log(error);
    }
});

router.get('/:idCat', async (req, res) => {
    var myregexp = /^[0-9a-fA-F]{24}$/;
    const idCat = req.params.idCat;

    if (!myregexp.test(idCat)) {
        return res.status(404).json({ success: false, message: 'nodfound...' });
    }
    // console.log(idCat);
    try {
        let catPackage = await CatData.findOne({ _id: new ObjectId(idCat) });

        if (!catPackage) {
            return res.status(404).json({ success: false, message: 'notfound...' });
        }

        const newCatPackage = {
            _id: catPackage._id,
            nameCatPackge: catPackage.nameCatPackge,
        };

        res.json({ success: true, catPackage: newCatPackage });
    } catch (error) {
        console.log(error);
    }
});

router.put('/', verifyToken, async (req, res) => {
    const { catPackageId, nameCatPackge, sort } = req.body;

    try {
        updateCat = await CatData.findOneAndUpdate({ _id: catPackageId }, { nameCatPackge });
        if (!updateCat)
            return res.status(401).json({
                success: false,
                message: 'Cat not found or user not authorised',
            });
        res.json({ success: true, message: 'Update successfulsss' });
    } catch (error) {
        console.log(error);
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deteleCat = await CatData.findOneAndDelete({
            _id: new ObjectId(req.params.id),
        });

        if (!deteleCat)
            return res.status(401).json({
                success: false,
                message: 'Cat not found or user not authorised',
            });

        await BoardMain.updateOne({
            $pullAll: { CatIdOrder: [req.params.id], Categorys: [req.params.id] },
        });

        res.json({ success: true, del: deteleCat });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'internal server error' });
    }
});

module.exports = router;
