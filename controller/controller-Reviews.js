const { patch } = require('../app')
const{ fetchReviews, fetchReviewById, patchRewview} = require('../model/model-Reviews')
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
    next(err)
})
}
exports.updateReview = (req, res, next)=>{
const {review_id} = req.params
const {inc_votes} = req.body
return patchRewview(review_id, inc_votes).then((review)=>{
    res.status(200).send({review})
}).catch((err)=>{
    next(err)
})
}