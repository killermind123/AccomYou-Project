const Listing = require('../model/list.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.Map_Token;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });



module.exports.index =  async (req, res) => {
  const allListing = await Listing.find();
  res.render('listings/index.ejs', { listings: allListing });
}

module.exports.listingForm = (req, res) => {
  res.render('listings/new.ejs');    
}

module.exports.userProfile = async (req, res) => {
    const listings = await Listing.find({ owner: req.user._id });
    res.render('users/profile.ejs', { listings });
  }

module.exports.addListing = async (req, res) => {
 let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 2
})
  .send()
  console.log(req.body.facilities);

  




  const newListing = new Listing(req.body.listing);  
  newListing.owner = req.user._id;
  newListing.facilities = req.body.facilities;
  if(typeof req.file !== 'undefined'){
  let url = req.file.path;
  let filename = req.file.filename;
  newListing.image.url = url;
  newListing.image.filename = filename;
  }
  let geometry = response.body.features[0].geometry;
  newListing.geometry = geometry;
  let r = await newListing.save();
  console.log(r);
  req.flash('success', 'Successfully made a new listing!');
  res.redirect('/listings');
  }

  module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing){
      req.flash('error', 'Listing Does not Found');
      //throw new ExpressError(404, 'Listing not found');
      
    } 

    let originalurl = listing.image.url;
    originalurl = originalurl.replace('/upload/', '/upload/h_250,w_300,c_fill/');

    
    res.render('listings/edit.ejs', { listing, originalurl });     
  }

  module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: 'review', populate: { path: 'author' } })
        .populate('owner');

    if (!listing) throw new ExpressError(404, 'Listing not found');

    res.render('listings/show.ejs', { listing });
}

module.exports.updateListing = async (req, res) => {
  console.log(req.body);
  let response = await geocodingClient.forwardGeocode({
  query: req.body.location,
  limit: 2
})
  .send()

    const { id } = req.params;
    const { title, description, price, location, country } = req.body;
     const updated = await Listing.findByIdAndUpdate(
      id, 
      { title, description, price, location, country }, 
      { new: true, runValidators: true }
    );
    if(typeof req.file !== 'undefined'){
     const url = req.file.path;
    updated.image.url = url;    
    }

    let geometry = response.body.features[0].geometry;
    updated.geometry = geometry;
    await updated.save();
    if (!updated) throw new ExpressError(404, 'Listing not found');
    if(!updated.title || !updated.description || !updated.price || !updated.location || !updated.country) {
      throw new ExpressError(400, 'All fields are required');
    }
    req.flash('success', 'Successfully updated listing');
    res.redirect(`/listings/${id}`);
  }  

  module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const deleted = await Listing.findByIdAndDelete(id);
    if (!deleted) throw new ExpressError(404, 'Listing not found');
    req.flash('success', 'Successfully Deleted a listing!');
    res.redirect('/listings');
  }

  