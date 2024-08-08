const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findOne({_id:req.params.id});
    let newreview=await new Review(req.body.review);
    newreview.author=req.user._id;
    console.log(newreview);
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();

    req.flash("success","New review created !");
    res.redirect(`/listings/${listing._id}`);
    
}
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findOneAndDelete({_id:reviewId});
    req.flash("success","Review deleted !");
    res.redirect(`/listings/${id}`);
}