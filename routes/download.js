var express = require('express');
var router = express.Router();
var dbData = require('../services/download')

/* GET getCount. */
router.get('/getCount', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    dbData.selectall('Calculation', function (result) {
        res.send(result);
    })
})

/* GET addCountForWin7. */
router.get('/addCountForWin7', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
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
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
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