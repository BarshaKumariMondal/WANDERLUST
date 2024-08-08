const express=require("express");
const router=express.Router();
const WrapAsync=require("../utils/wrapasync.js");
const {isLoggedIn,isOwner,validatelisting}=require("../middleware.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});
// const upload=multer({dest:"uploads/"});

const listingController=require("../controllers/listings.js");

router.route("/")
    .get(WrapAsync(listingController.index ))  //Index Route
    .post(isLoggedIn,
        upload.single("listing[image]"),
        validatelisting ,
        WrapAsync(listingController.createListing)); //create route
    // .post(upload.single("listing[image]"),(req,res)=>{
    //     res.send(req.file);
    // });
    
//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);


router.route("/:id")
    .get(WrapAsync(listingController.showListing)) //Show Route
    .put(isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validatelisting,
        WrapAsync(listingController.updateListing)) //update route
    .delete(isLoggedIn,isOwner,WrapAsync(listingController.destroyListing)); //delete route
    
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,WrapAsync(listingController.renderEditForm));


module.exports=router;

