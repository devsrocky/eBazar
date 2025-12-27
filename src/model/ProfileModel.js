const mongoose = require('mongoose');
const DataSchema = mongoose.Schema({

    userID: {type: mongoose.Schema.Types.ObjectId, required: true},
    cus_add: {type: String, default: ''},
    cus_city: {type: String, default: ''},
    cus_country: {type: String, default: ''},
    cus_fax: {type: String, default: ''},
    cus_name: {type: String, default: ''},
    cus_phone: {type: String, default: ''},
    cus_postcode: {type: String, default: ''},
    cus_state: {type: String, default: ''},

    ship_add: {type: String, default: ''},
    ship_city: {type: String, default: ''},
    ship_country: {type: String, default: ''},
    ship_name: {type: String, default: ''},
    ship_phone: {type: String, default: ''},
    ship_postcode: {type: String, default: ''},
    ship_state: {type: String, default: ''}

}, {timestamps: true, versionKey: false});

const ProfileModel = mongoose.model('profiles', DataSchema);
module.exports = ProfileModel;