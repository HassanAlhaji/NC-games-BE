const { fetchComments , createComment, removCOmment} = require("../model/model-Comments")
const {
  fetchReviewById,
  reviewExists,
} = require("../model/model-Reviews");

exports.getComments = (req, res, next)=>{
const {review_id} = req.params
fetchComments(review_id).then(comments=>{
    res.status(200).send({comments})
}).catch((err)=>{
    next(err)
})

}

exports.postComment = (req, res, next) => {
  
  const reviewId = req.params.review_id;
  const username = req.body.username;
  const body = req.body.body;

      createComment(username, reviewId, body)
        .then((comment) => {
          res.status(201).send({ comment });
        })
        .catch((error) => {
          next(error);
        });
};

exports.deleteComment =(req, res, next)=>{
const {comment_id} = req.params
removCOmment(comment_id).then(comment=>{
  console.log(comment);
  res.status(204).send(comment)

})

}