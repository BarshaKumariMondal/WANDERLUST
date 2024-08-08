const Listing=require("./models/listing");
const Review=require("./models/review.js");

const ExpressError=require("./utils/ExpressError.js");
const {Listingschema,ReviewSchema}=require("./Schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in");
        req.session.redirectUrl=req.originalUrl;
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listing !")
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validatelisting=(req,res,next)=>{
    let {error}=Listingschema.validate(req.body);
    if (error){
        console.log(error);
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
};
module.exports.validateReview=(req,res,next)=>{
    let {error}=ReviewSchema.validate(req.body);
    if (error){
        console.log(error);
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
};
module.exports.isAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    console.log(review);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this review !")
        return res.redirect(`/listings/${id}`);
    }
    next();
}
