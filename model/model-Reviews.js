const db = require("../db/connection");
exports.reviewExists = (reviewId) => {
  let query = "select exists(select 1 from reviews where review_id = $1)";

  return db.query(query, [reviewId]).then((result) => {
    return result.rows[0].exists;
  });
};
exports.fetchReviews = () => {
  return db
    .query(
      `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, CAST(COUNT(comments.review_id) AS INT) AS comment_count FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY comment_count DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};
exports.fetchReviewById = (reviewId) => {
  if (isNaN(reviewId)) {
    return Promise.reject({
      msg: "bad request",
      status: 400,
    });
  }
  return db
    .query(`SELECT * FROM  reviews WHERE review_id = $1;`, [reviewId])
    .then((result) => {
      return result.rows[0];
    });
};
exports.patchRewview = (reviewId, incVotes)=>{
    const query = `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`
    return db.query(query, [incVotes, reviewId]).then(result =>{
      return result.rows[0]
    })
}