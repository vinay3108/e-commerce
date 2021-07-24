const express=require('express');
const router=express.Router();
const Product=require('../models/product');
const Review=require('../models/review');
const {isLoggedIn}=require('../middlewares');

//Displa all the products
router.get('/products',async(req,res)=>{
    try{
        const products= await Product.find({});
        res.render('products/index',{products});
    }catch(e){
        console.log(e.message);
        req.flash('error','Cannot Find Products');
        res.redirect('/error');
    }
        
})



//Get the form for new Product
router.get('/products/new',isLoggedIn,(req,res)=>{
    try{
        
        res.render('products/new');
        // console.log(req.user.username);
    }
    catch(e){
        console.log(e.message);
        req.flash('error','Cannot Get Form for New Product');
        res.redirect('/error');
    }
})


//Create New Product
router.post('/products',isLoggedIn,async(req,res)=>{
    try{
    
        await Product.create(req.body.product);
        req.flash('success','Product Created Successfully');
        res.redirect('/products');
    }
    catch(e){
        console.log(e.message);
        req.flash('error','Cannot Create New Product');
        res.redirect('/error');
    }
})

//Show Particular Product
router.get('/products/:id',async(req,res)=>{
    try{
        const {id}=req.params;
       const product= await Product.findById(id).populate('reviews');  //populate fill whole data like  review fill in product (inflate)
    //    console.log(product);
       res.render('products/show',{product});
    }
    catch(e){
        console.log(e.message);
        req.flash('error','Cannot Find Product');
        res.redirect('/error');
    }
})

//Form for edit any Particular Product
router.get('/products/:id/edit',isLoggedIn,async(req,res)=>{
    try{
        const {id}=req.params;
        const product=await Product.findById(id)
        res.render('products/edit',{product});
    }
    catch(e){
        console.log(e.message);
        req.flash('error','Cannot Get Form for Edit Product');
        res.redirect('/error');
    }
    
})

//Edit Any Particular Product
router.patch('/products/:id',isLoggedIn,async(req,res)=>{
    try{

        const {id}=req.params;
        await Product.findByIdAndUpdate(id,req.body.product);
        req.flash('success','Product Updated Successfully');
        res.redirect(`/products/${id}`);
    }
    catch(e){
        console.log(e.message);
        req.flash('error','Cannot Edit Product');
        res.redirect('/error');
    }
})

//Delete any Particular Product

router.delete('/products/:id',isLoggedIn,async(req,res)=>{
    try{

        const {id}=req.params;
        await Product.findByIdAndDelete(id); 
        res.redirect('/products');
    }
    catch(e){
        console.log(e.message);
        req.flash('error','Cannot Delete Particular Product');
        res.redirect('/error');
    }
})



//Creating a New Comment on a Product
router.post('/products/:id/review',isLoggedIn,async(req,res)=>{
    try{

        const {id}= req.params;
        const product =await Product.findById(id);
        // const review=new Review(req.body); older without username
        const review=new Review({
            user:req.user.username,
            ...req.body     //with user name with the help of Spread {...} Operator
        }); 
        // console.log(review);
        product.reviews.push(review);
        await review.save();
        await product.save();
        res.redirect(`/products/${id}`);
        // res.send('You Hit The Comment Route!');
    }
    catch(e){
        console.log(e.message);
        req.flash('error','Cannot Create New Comment');
        res.redirect('/error');
    }
    
})


//Error Handler
router.get('/error',(req,res)=>{
    res.status(500).render('error');
})

module.exports=router;