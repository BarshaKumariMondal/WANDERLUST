if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}
// require("dotenv").config();
// console.log(process.env.CLOUD_API_SECRET);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
// const WrapAsync=require("./utils/wrapasync.js");
const ExpressError=require("./utils/ExpressError.js");
// const {Listingschema,ReviewSchema}=require("./Schema.js");
// const Listing=require("./models/listing");
// const Review=require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");

const listingrouter=require("./routes/listing.js");
const reviewrouter=require("./routes/review.js");
const userrouter=require('./routes/user.js');

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const dbURL=process.env.ATLASDB_URL;

main()
.then((res)=>{
    console.log("connection successful with db");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dbURL);
}

const store=MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: "secretcode"
    },
    touchAfter: 24 * 3600
});

store.on("error",()=>{
    console.log("ERRON IN MONGO SESSION STORE",err);
});

const sessionoptions={
    store,
    secret:"secretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expores:Date.now() + 7*34*60*60*1000,
        maxAge:7*34*60*60*1000,
        httpOnly:true
    }
};
app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser=await User.register(fakeuser,"helloworld");
//     res.send(registeredUser);
// });

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/",(req,res)=>{
//     res.send("working!");
// });

app.use("/listings",listingrouter);
app.use("/listings/:id/reviews",reviewrouter);
app.use("/",userrouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(500,"Page Not Found !!"));
});

app.use((err,req,res,next)=>{
    let {status=500,message}=err;
    res.status(status).render("error.ejs",{err});
    // res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log("Listening to port 8080");
});