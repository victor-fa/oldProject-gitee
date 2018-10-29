var express = require('express');
var router = express.Router();
// var downloadModel = require('../models/download')
var dbData = require('../services/download')

/* GET getCount. */
router.get('/getCount', (req, res, next) => {
    dbData.selectall('Calculation', function(result){
        res.send(result);
    })
})

/* GET addCountForWin7. */
router.get('/addCountForWin7', (req, res, next) => {
    dbData.selectall('Calculation', function(result){
        if (result !== null) {
            const countForWin7 = result[0].countForWin7;
            dbData.updateCountForWin7('Calculation', countForWin7, function(result){
                res.send(result);
            })
        }
    })
})

/* GET addCountForWin10. */
router.get('/addCountForWin10', (req, res, next) => {
    dbData.selectall('Calculation', function(result){

        if (result !== null) {
            const countForWin10 = result[0].countForWin10;
            dbData.updateCountForWin10('Calculation', countForWin10, function(result){
                res.send(result);
            })
        }
    })
})

// var dbData = {
//     selectall: function(name, callback){
//         downloadModel.find({}, (err, result, res) => {
//             const Calculation = require('../models/download');
//             if(err) return console.log(err);
//             if (result[0] === undefined) {  // 无数据,第一次会新增空数据~
//                 var calculation = new Calculation({
//                     countForWin7: 0,
//                     countForWin10: 0
//                 });
//                 calculation.save(function(err){
//                     if(err) console.log(err)
//                 });
//                 callback(result);
//             } else {
//                 callback(result);
//             }
//         })
//     },
//     updateCountForWin7: function(name, toCount, callback){
//         const conditions = {countForWin7: toCount};
//         const updates = {countForWin7: toCount+1};
//         downloadModel.update(conditions, updates, {multi: true}, (err) => {
//             if(err) return console.log(err);
//         })
//     },
//     updateCountForWin10: function(name, toCount, callback){
//         const conditions = {countForWin10: toCount};
//         const updates = {countForWin10: toCount+1};
//         downloadModel.update(conditions, updates, {multi: true}, (err) => {
//             if(err) return console.log(err);
//         })
//     }
// }

module.exports = router;
