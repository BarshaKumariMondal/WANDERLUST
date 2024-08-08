const User=require("../models/user.js");


module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new User({username,email});
        let registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next();
            }
            req.flash("success","Welcome to wanderLust !");
            res.redirect("/listings");
        })
       
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};
module.exports.renderLogInForm=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to WANDERLUST.");
    let redirectUrl=res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl);
};
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next();
        }
        req.flash("success","you have been logged out successfully !")
        res.redirect("/listings");
    })
};