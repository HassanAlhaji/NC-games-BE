const{ fetchReviews} = require('../model/model-fetchReviews')
exports.getReviews = (req, res, next)=>{
    fetchReviews().then((reviews)=>{
        res.status(200).send({reviews})
    })
}
