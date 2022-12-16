const db = require("../db/connection");

exports.createComment = (username, reviewId, body) => {
  // if (isNaN(reviewId)) {
  //   return Promise.reject({
  //     msg: "bad request",
  //     status: 400,
  //   });
  // }

  let query =
    "INSERT INTO comments (author, review_id, body, created_at) VALUES ($1, $2, $3, current_timestamp) returning *;";

  return db
    .query(query, [username, reviewId, body])
    .then((result) => {
      return result.rows[0];
    })
    // .catch((error) => console.log(error));
};