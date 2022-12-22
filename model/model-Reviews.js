const db = require("../db/connection");
exports.reviewExists = (reviewId) => {
  let query = "select exists(select 1 from reviews where review_id = $1)";

  return db.query(query, [reviewId]).then((result) => {
    return result.rows[0].exists;
  });
};
exports.fetchReviews = (category, sort_by='created_at', order=' DESC') => {
  // let queryStr = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, CAST(COUNT(comments.review_id) AS INT) AS comment_count FROM reviews
  // LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.category = strategy GROUP BY reviews.review_id ORDER BY comment_count DESC;`
  const validCategory = ['strategy', 'hidden-roles', 'dexterity', 'push-your-luck', 'roll-and-write', 'deck-building', 'engine-building', 'euro game','social deduction',"children's games" ]
  const values = []
  const validOrders =['ASC', 'DESC']
  const validSorts = [
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "review_body",
    "review_img_url",
    "created_at",
    "votes",
    "comment_count",
  ];
  console.log(category)
  let queryStr = `SELECT reviews.*, CAST(COUNT(comments.review_id) AS INT) AS comment_count FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id`;

  if(category && validCategory.includes(category)){
    queryStr+= " WHERE reviews.category = $1"
    values.push(category)
  }
 
  queryStr+= " GROUP BY reviews.review_id"
  if(validSorts.includes(sort_by)){
    queryStr+=` ORDER BY ${sort_by} `
  }else{
    queryStr+=` ORDER BY created_at `
  }
  if(validOrders.includes(order)){
    queryStr += ` ${order}`
  }else{
    queryStr += `DESC`
  }
  return db
    .query(queryStr,values)
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