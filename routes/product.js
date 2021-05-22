const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/reviews');
//const Reviews = require('../models/reviews');

// Display all the products
router.get('/products', async(req, res) => {
    
    const products=await Product.find({});

    res.render('products/index',{products});
})


// Get the form for new product
router.get('/products/new', (req, res) => {
    res.render('products/new');
})


// Create New Product
router.post('/products', async(req, res) => {
    
    console.log(req.body.product);

    await Product.create(req.body.product);

    res.redirect('/products');
});

router.post('/products/:id/reviews',async(req,res)=>{
    console.log(req.body);
    const newRev=await Review.create({'rating':req.body.range,'comments':req.body.desc});//new Review
    console.log(newRev);
    console.log(req.params);
    const oldProd=await Product.findById(req.params.id);
    oldProd.reviews.push(newRev._id);//newRev will work in place of newRev._id as mongoose stores the id behind the scenes
    await oldProd.save();
    await newRev.save();
    
    
    res.redirect(`/products/${req.params.id}`);
})

// Show particular product
router.get('/products/:id', async(req, res) => {
    
    const product=await(Product.findById(req.params.id)).populate('reviews');
    console.log(product);
    res.render('products/show', { product });
})

// Get the edit form
router.get('/products/:id/edit', async(req, res) => {

    const product=await Product.findById(req.params.id);

    res.render('products/edit',{product});
})

// Upadate the particular product
router.patch('/products/:id', async(req, res) => {
    
    await Product.findByIdAndUpdate(req.params.id, req.body.product);

    res.redirect(`/products/${req.params.id}`)
})


// Delete a particular product
router.delete('/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
})


module.exports = router;