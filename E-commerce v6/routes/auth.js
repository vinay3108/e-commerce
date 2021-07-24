const express=require('express');
const router=express.Router();
const User=require('../models/user');
const passport=require('passport');

// router.get('/fakeuser',async(req,res)=>{

//     const user=new User({email:'vinay@gmail.com',username:'vinay'});
//    const newUser=await User.register(user,'vinay12');
//    res.send(newUser);

// })


router.get('/register',async(req,res)=>{
  res.render('auth/signup');
})

router.post('/register',async(req,res)=>{
    try{
        const user=new User({username:req.body.username,email:req.body.email});
        const newUser=await User.register(user,req.body.password);
        console.log(newUser);
        req.flash('success','Registered Successfully');
        res.redirect('/products');
    }
    catch(e)
    {
        // console.log(e.message);
        req.flash('error',e.message);
        res.redirect('/register');
    }
})
//Get the Login form
router.get('/login',async(req,res)=>{
    res.render('auth/login');
})

router.post('/login',
  passport.authenticate('local', 
    {
        failureRedirect: '/login',
        failureFlash: true 
    }
  
),(req,res)=>{
    req.flash('success',`Welcome Back !! ${req.user.username}`);
    // console.log(currentUser);   //use to view user 
    res.redirect('/products')
});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','Logged Out Successfully');
    res.redirect('/products');
})

module.exports=router;
