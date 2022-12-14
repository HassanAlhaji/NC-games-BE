const{ fetchReviews, fetchReviewById} = require('../model/model-fetchReviews')
exports.getReviews = (req, res, next)=>{
    fetchReviews().then((reviews)=>{
        res.status(200).send({reviews})
    }).catch((err)=>{
        next(err)
    })
}
exports.getReviewById =(req, res, next)=>{
    const {review_id} = req.params
  
fetchReviewById(review_id).then((review)=>{
    res.status(200).send(review)
}).catch((err)=>{
    console.log(err)
    next(err)
})
}