const Review = require('../model/reviews.js');
const Listing = require('../model/list.js');

module.exports.addReview = async (req,res)=>{
  const {id} = req.params;
  const findlisting = await Listing.findById(id); 
  
  console.log(findlisting);

  

    const newReview= new Review(req.body.review)
    newReview.author= res.locals.currentUser._id;
    console.log(newReview);

  

  findlisting.review.push(newReview);

  await newReview.save();
  await findlisting.save()
  req.flash('success', 'Successfully added a review');

  res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  let delte = await Review.findByIdAndDelete(reviewId);
  if(delte){
    req.flash('success', 'Successfully Deleted a review');
  res.redirect(`/listings/${id}`);
  }else{
    req.flash('error', 'not deleted');
    res.redirect(`/listings/${id}`);
  }
  
}