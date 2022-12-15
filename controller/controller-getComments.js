const { fetchComments } = require("../model/model-fetchComments")

exports.getComments = (req, res, next)=>{
const {review_id} = req.params
fetchComments(review_id).then(comment=>{
    res.status(200).send(comment)
}).catch((err)=>{
    next(err)
})

}