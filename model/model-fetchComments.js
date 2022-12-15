const db = require('../db/connection')
exports.fetchComments = (reviewId)=>{
return db.query(`SELECT comment_id, votes, created_at, author, body, review_id FROM comments WHERE  review_id = $1 
ORDER BY comment_id DESC;`,[reviewId]).then(result=>{
    return result.rows
})
}