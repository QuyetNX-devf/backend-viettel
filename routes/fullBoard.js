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

//@router GEt api/auth/fullBoard
//@access Public

router.get('/', async (req, res) => {
  try {
    let fullBoard = await BoardMain.findOne().populate({
      path: 'Categorys',
      populate: {
        path: 'pakageDatas',
      },
    });

    res.json({ success: true, fullBoard });
  } catch (error) {
    console.log(error);
  }
});

router.put('/sort-cat', verifyToken, async (req, res) => {
  const { indexA, indexB } = req.body;

  console.log({ indexA, indexB });
  if (typeof indexA != 'number' || typeof indexB != 'number') {
    return res.status(404).json({ success: false, message: 'Chưa nhập index' });
  }

  try {
    const doc = await BoardMain.findOne();
    if (!doc.CatIdOrder[indexA] || !doc.CatIdOrder[indexB]) {
      return res
        .status(404)
        .json({ success: false, message: 'not found index package' });
    }

    await BoardMain.updateOne({
      $set: {
        [`CatIdOrder.${indexA}`]: doc.CatIdOrder[indexB],
        [`CatIdOrder.${indexB}`]: doc.CatIdOrder[indexA],
        [`Categorys.${indexA}`]: doc.Categorys[indexB],
        [`Categorys.${indexB}`]: doc.Categorys[indexA],
      },
    });

    res.status(200).json({ success: true, message: 'swap successfulsss' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'error server' });
  }
});

module.exports = router;
