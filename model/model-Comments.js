const db = require("../db/connection");
const comments = require("../db/data/test-data/comments");

exports.fetchComments = (reviewId) => {
  if (isNaN(reviewId)) {
    return Promise.reject({
      msg: "bad request",
      status: 400,
    });
  }
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, review_id FROM comments WHERE  review_id = $1 
ORDER BY comment_id DESC;`,
      [reviewId]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return [];
      }
      return result.rows;
    });
};

exports.createComment = (username, reviewId, body) => {
  let query =
    "INSERT INTO comments (author, review_id, body, created_at) VALUES ($1, $2, $3, current_timestamp) returning *;";

  return db.query(query, [username, reviewId, body]).then((result) => {
    return result.rows[0];
  });
};

exports.removCOmment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id =$1 RETURNING *;`, [
      comment_id,
    ])
    .then((result) => {
      return result.rows[0];
    });
};
