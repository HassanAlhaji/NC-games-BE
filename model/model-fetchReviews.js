const db = require("../db/connection");

exports.fetchReviews = () => {
    return db.query(`SELECT * FROM reviews;`).then(result => {
        const newArray = result.rows.map((review)=>{
            return db.query(`SELECT * FROM comments WHERE review_id = ${review.review_id}`).then(result =>{
                review.commet_count = result.rowCount
                return review
            })
        })
        return Promise.all(newArray)
    })
}
