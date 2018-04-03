const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;

const ProduktSchema = new Schema({
    category: {type: Schema.Types.ObjectId, ref:'Category'},

    name: String,
    price: Number,
    image: String
});

ProduktSchema.plugin(mongoosastic,{
    hosts:[
        'localhost:9200'
    ]
});


module.exports=mongoose.model('Produkt',ProduktSchema);