var downloadModel = require('../models/download')

var dbData = {
    selectall: function(name, callback){
        downloadModel.find({}, (err, result, res) => {
            const Calculation = require('../models/download');
            if(err) return console.log(err);
            if (result[0] === undefined) {  // 无数据,第一次会新增空数据~
                var calculation = new Calculation({
                    countForWin7: 0,
                    countForWin10: 0
                });
                calculation.save(function(err){
                    if(err) console.log(err)
                });
                callback(result);
            } else {
                callback(result);
            }
        })
    },
    updateCountForWin7: function(name, toCount, callback){
        const conditions = {countForWin7: toCount};
        const updates = {countForWin7: toCount+1};
        downloadModel.update(conditions, updates, {multi: true}, (err) => {
            if(err) return console.log(err);
            callback('OK');
        })
    },
    updateCountForWin10: function(name, toCount, callback){
        const conditions = {countForWin10: toCount};
        const updates = {countForWin10: toCount+1};
        downloadModel.update(conditions, updates, {multi: true}, (err) => {
            if(err) return console.log(err);
            callback('OK');
        })
    }
}

module.exports = dbData;
