const Listing=require('../Models/listing.js');
module.exports.index=async (req,res)=>{
    const all=await Listing.find({});
    res.render('listings/index.ejs',{all});
}

module.exports.renderNewForm=(req,res)=>{
    // console.log(req.user);
    res.render('listings/new.ejs');
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:'reviews',populate:{path:'author'},}).populate('owner');
    if(!listing){
        req.flash('error','Listing does not exist');
        res.redirect('/listing')
    }
    console.log(listing);
    res.render('listings/show.ejs',{listing});
}

module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url,';;',filename);

    // if(!req.body.listing){
    //     throw new ExpressError(400,'send new valid data for listing');
    // }
    // let {title,description,image,price,location,country}=req.body;
    const newListing=new Listing(req.body.listing);
    // if(!newListing.title){
    //     throw new ExpressError(400,'title is missing');
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400,'description is missing');
    // }
    // if(!newListing.location){
    //     throw new ExpressError(400,'location is missing');
    // }
    // console.log(req.user);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash('success','New Listing Created');
    res.redirect('/listing');
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash('error','Listing does not exist');
        res.redirect('/listing')
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300/w_200");
    res.render('listings/edit.ejs',{listing,originalImageUrl});
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing}); 
    if(typeof req.file!=='undefined'){ 
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash('success','Listing Updated');
    res.redirect('/listing');
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success','Listing Deleted');
    res.redirect('/listing');
}