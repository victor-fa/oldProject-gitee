var express = require('express');
var router = express.Router();
var dbData = require('../services/download')

/* GET getCount. */
router.get('/getCount', (req, res, next) => {
    dbData.selectall('Calculation', function (result) {
        res.send(result);
    })
})

/* GET addCountForWin7. */
router.get('/addCountForWin7', (req, res, next) => {
    dbData.selectall('Calculation', function (result) {
        if (result !== null) {
            const countForWin7 = result[0].countForWin7;
            dbData.updateCountForWin7('Calculation', countForWin7, function (result) {
                res.send(result);
            })
        }
    })
})

/* GET addCountForWin10. */
router.get('/addCountForWin10', (req, res, next) => {
    dbData.selectall('Calculation', function (result) {

        if (result !== null) {
            const countForWin10 = result[0].countForWin10;
            dbData.updateCountForWin10('Calculation', countForWin10, function (result) {
                res.send(result);
            })
        }
    })
})

module.exports = router;