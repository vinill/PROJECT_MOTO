const router = require('express').Router();
const faker = require('faker');
var async = require('async');
const Category = require('../models/category');
const Product = require('../models/produkt');


router.post('/search',(req,res,next)=>{
    console.log(req.body.search_term);
    Product.search({
        query_string:{query: req.body.search_term}
    },(err,results)=>{
        if(err) return next(err);
        res.json(results);
        }
        )
});

router.get('/:name',async (req,res,next)=>{
    async.waterfall([
        function(callback) {
            Category.findOne({ name: req.params.name }, function(err, category) {
                if (err) return next(err);
                callback(null, category);
            });
        },

        function(category, callback) {
            for (var i = 0; i < 30; i++) {
                var product = new Product();
                product.category = category._id;
                product.name = faker.commerce.productName();
                product.price = faker.commerce.price();
                product.image = 'https://picsum.photos/320/240/?image='+i;

                product.save();
            }
        }
    ]);
    res.json({ message: 'Success' });
});


module.exports = router;