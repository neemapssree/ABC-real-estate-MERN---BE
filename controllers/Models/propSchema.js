const mongoose = require('mongoose');

const propSchema = new mongoose.Schema({
    propname:{
        type:String,
        required:true,
        unique:true
    },
    state:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    beds:{ 
        type: [String],
        required: true
    },
    baths: {
        type: [String],
        required: true
    },
    price: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    handover: {
        type: String,
        required: false
    },
    propaddress:{
        type:String,        
    },
    propImg:{
        type:String,
        required:true
    },  
    isFeatured:{
        type:Boolean,
        default:false
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const properties = mongoose.model("properties", propSchema);
module.exports = properties;