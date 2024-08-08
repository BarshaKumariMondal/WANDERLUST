const express=require("express");
const router=express.Router({mergeParams:true});
const WrapAsync=require("../utils/wrapasync.js");
const {validateReview,isLoggedIn,isAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

//Reviews
router.post("/",isLoggedIn,validateReview, WrapAsync(reviewController.createReview));

//Delete reviews
router.delete("/:reviewId",isLoggedIn,isAuthor,WrapAsync(reviewController.destroyReview));

module.exports=router;