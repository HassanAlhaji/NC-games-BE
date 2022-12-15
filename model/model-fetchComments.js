const db = require('../db/connection')
exports.fetchComments = (reviewId)=>{
    if(isNaN(reviewId)){
        return Promise.reject({
            msg:"bad request",
            status:400
        })
    }
return db.query(`SELECT comment_id, votes, created_at, author, body, review_id FROM comments WHERE  review_id = $1 
ORDER BY comment_id DESC;`,[reviewId]).then((result)=>{
   
    if (result.rowCount ===0){
        return []
    }
    
    return result.rows
})
}