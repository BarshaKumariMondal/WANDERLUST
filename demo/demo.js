const express=require("express");
const app=express();
const cookieParser=require("cookie-parser");
const session = require("express-session");
const flash=require("connect-flash");
const path=require("path");

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"));
// app.use(cookieParser("secretcode"));
// app.get("/sendcookies",(req,res)=>{
//     res.cookie("name","barsha",{signed:true});
//     res.send("cookie sent");
// });

// app.get("/getcookies",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("cookie received");
// });
// app.get("/verify",(req,res)=>{
//     console.dir(req.signedCookies);
//     res.send("cookie received");
// });

app.use(session({
    secret:"seccretcode",
    resave:false,
    saveUninitialized:true,
}));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.msg=req.flash("name");
    next();
});
app.get("/demo",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`you sent a request ${req.session.count} times`);
})
app.get("/demo2",(req,res)=>{
    const {name="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous"){
        req.flash("name","not registered ");
    }else{
        req.flash("name","user registered successfully");
    }
    res.redirect("/demo3");
})
app.get("/demo3",(req,res)=>{
    // console.log(req.flash("name"));
    // res.render("abc.ejs",{name:req.session.name, msg:req.flash("name")});
    res.render("abc.ejs",{name:req.session.name});
})
app.listen(3000,()=>{
    console.log("listening to port 3000");
})