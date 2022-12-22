const db = require('../db/connection')
exports.getUser =() =>{

return db.query(`SELECT * FROM users`).then(result => {
    return result.rows
})
}