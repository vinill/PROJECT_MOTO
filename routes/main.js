const router = require('express').Router();
const Product = require('../models/produkt');
const User = require('../models/user');
const Cart = require('../models/cart');

function paginate(req,res,next){
    const perPage = 9;
    const page = req.params.page;

    Product
        .find()
        .skip(perPage*page)
        .limit(perPage)
        .populate('category')
        .exec((err,products)=>{
            if(err) return next(err);
            Product.count().exec((err,count)=>{
                if (err) return next(err);
                res.render('main/product-main',{
                    products:products,
                    pages: count / perPage
                });
            });
        });
}

Product.createMapping((err,mapping)=>{
    if(err){
        console.log("error")
        console.log(err);
    } else {
        console.log("created");
        console.log(mapping);
    }
});

const stream = Product.synchronize();
let count = 0;

stream.on('data',()=>{
    count++;
});

stream.on('close',()=>{
    console.log("Indexed "+ count + " documents");
});

stream.on('error',(err)=>{
    console.log(err);
});

router.get('/cart', function(req, res, next) {
    Cart
        .findOne({ owner: req.user._id })
        .populate('items.item')
        .exec(function(err, foundCart) {
            if (err) return next(err);
            res.render('main/cart', {
                foundCart: foundCart,
                message: req.flash('remove')
            });
        });
});

router.post('/remove', function(req, res, next) {
    Cart.findOne({ owner: req.user._id }, function(err, foundCart) {
        foundCart.items.pull(String(req.body.item));

        foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);
        foundCart.save(function(err, found) {
            if (err) return next(err);
            req.flash('remove', 'Successfully removed');
            res.redirect('/cart');
        });
    });
});


router.post('/product/:product_id', function(req, res, next) {
    Cart.findOne({ owner: req.user._id }, function(err, cart) {
        cart.items.push({
            item: req.body.product_id,
            price: parseFloat(req.body.priceValue),
            quantity: parseInt(req.body.quantity)
        });

        cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);

        cart.save(function(err) {
            if (err) return next(err);
            return res.redirect('/cart');
        });
    });
});

router.post('/search',(req,res,next)=>{
    res.redirect('/search?q='+req.body.q);
});

router.get('/search',(req,res,next)=>{
    if(req.query.q){
        Product.search({
            query_string: {query:req.query.q}
        },(err,results)=>{
            if (err) return next(err);
            const data = results.hits.hits.map((hit)=>{
                return hit;
            });
            res.render('main/search-result',{
                query: req.query.q,
                data: data
            })
        });
    }
});

router.get('/',(req,res,next)=>{
    if(req.user){
        paginate(req,res,next)
    }else{
        res.render('main/home');
    }
});
router.get('/page/:page',(req,res,next)=>{
    paginate(req,res,next);
});

router.get('/about',(req,res)=>{
    res.render('main/about');
});

router.get('/products/:id',(req,res,next)=>{
    Product.
        find({category:req.params.id})
        .populate('category')
        .exec((err,products)=>{
            if(err) return next(err);
            res.render('main/category', {
                products: products
            })
        })
});

router.get('/product/:id',(req,res,next)=>{
    Product.findById({_id:req.params.id},(err,product)=>{
        res.render('main/product',{
            product:product
        });
    });
});

module.exports  = router;