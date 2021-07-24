const express=require('express');
const router=express.Router();
const {isLoggedIn}=require('../middlewares');       // ise object export kiya tha esliye ise require kr rhe h
const Product=require('../models/product');
const User=require('../models/user');

router.get('/user/:id/cart',isLoggedIn,async(req,res)=>{
    try{

        const {id}=req.params;
        const user=await User.findById(id).populate('cart');
        res.render('cart/showCart',{userCart:user.cart});
    }
    catch(e)
    {
        req.flash('error', 'Unable to Add this product');
        res.render('error');
    }

});
router.post('/user/:id/cart',isLoggedIn,async(req,res)=>{
    try{

        const {id}=req.params;
        const product=await Product.findById(id);
    
        const user=req.user;
        user.cart.push(product);
        await user.save();
        req.flash('success','Added to Cart Successfully');
        res.redirect(`/user/${req.user._id}/cart`);

    }
    catch (e) {
        req.flash('error', 'Unable to get the cart at this moment');
        res.render('error');
    }

});

router.delete('/user/:userid/cart/:productid',async(req,res)=>{
    const {userid,productid}=req.params;
    await User.findByIdAndUpdate(userid,{$pull:{cart:productid}});      //Pull data from cart
    // res.send('You Hit the delete route');
    res.redirect(`/user/${req.user._id}/cart`);
    
})



//payment 
router.get('/cart/payment',(req,res)=>{
    res.render('payment/pay');
})
 









module.exports=router;