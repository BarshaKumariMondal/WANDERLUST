const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken});

module.exports.index=async(req,res)=>{
    const alllistings=await Listing.find();
    res.render("listings/index.ejs",{alllistings});
}
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.createListing=async(req,res,next)=>{
    // let {title,description,price,location,country}=req.body;

    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
    console.log(response.body.features[0].geometry);
    let url=req.file.path;
    let filename=req.file.filename;

    let newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New listing created !");
    res.redirect("/listings");
};
module.exports.renderEditForm=async(req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist !");
        res.redirect("/listings");
    }
    
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}
module.exports.updateListing=async(req,res,next)=>{
    let {id}=req.params;

    let newListing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        newListing.image={url,filename};
        await newListing.save();
    }
    req.flash("success","listing updated !");
    res.redirect(`/listings/${id}`);
}
module.exports.showListing=async(req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
        .populate({path:"reviews",
            populate:{path:"author"}})
        .populate("owner");
    console.log(listing);
    
    if(!listing){
        req.flash("error","Listing you requested does not exist !");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}
module.exports.destroyListing= async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted !");
    res.redirect("/listings");
}
