const { createComment } = require("../model/model-creatComments");
const {
  fetchReviewById,
  reviewExists,
} = require("../model/model-fetchReviews");

exports.postComment = (req, res, next) => {
  
  const reviewId = req.params.review_id;
  const username = req.body.username;
  const body = req.body.body;

  // reviewExists(reviewId).then((exists) => {
  //   if (exists) {
      createComment(username, reviewId, body)
        .then((comment) => {
          res.status(201).send({ comment });
        })
        .catch((error) => {
         
          next(error);
        });
    // } else {
    //   res.status(400).send({msg:"bad request"});
    // }
  // });
};