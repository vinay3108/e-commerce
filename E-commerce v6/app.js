if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}

const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
// const seedDB=require('./seed');
const methodOverride=require('method-override');
const session=require('express-session');
const flash=require('connect-flash');
const User=require('./models/user');
const passport=require('passport');
const LocalStrategy=require('passport-local');

//All Routes
const productRoutes=require('./routes/product');
const authRoutes=require('./routes/auth');
const cartRoutes=require('./routes/cart');



// console.log(process.env.SECRET);

mongoose.connect(process.env.DB_URL,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
.then(()=>{
    console.log("DB Connected");
})
.catch((err)=>{
    console.log("OH NO ERROR !!");
    console.log(err);
})

// seedDB();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

const sessionConfig={
    secret:'weneedsomebettersecret',
    resave:false,
    saveUninitialized:true

}
app.use(session(sessionConfig));
app.use(flash());


//middlewares for passport

//Initilize the passport and sessions for storing the user's Info
app.use(passport.initialize());
app.use(passport.session());
//Configuring the passport to use Local Strategy
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    // console.log(req.user.username);
    res.locals.currentUser=req.user;
    next();
})

app.get('/',(req,res)=>{

    res.render('products/home');
    // res.send('Landing Page');
})




// use Routes
app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);











    app.listen(process.env.PORT||3000,()=>{
        console.log("Server Running on Port 3000");
    })