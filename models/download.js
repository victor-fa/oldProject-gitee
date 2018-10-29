var mongoose = require('mongoose');

// User Schema
var CalculationSchema = mongoose.Schema({
    countForWin7: {
        type: Number
    },
    countForWin10: {
        type: Number
    }
});

var Download = module.exports = mongoose.model('Calculation', CalculationSchema);
