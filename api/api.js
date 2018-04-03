const router = require('express').Router();
const faker = require('faker');
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
    try {

        const category = await Category.findOne({name:req.params.name});

        for(let i = 0;i < 20; i++){
             const produkt = new Produkt();
             produkt.category=category._id;
             produkt.name = faker.commerce.productName();
             produkt.price = faker.commerce.price();
             produkt.image = 'https://picsum.photos/320/240/?image='+i;
             produkt.save();
        }

    } catch (e) {
        console.log(e);
    }


    res.send({message: 'Success'})
});



module.exports = router;