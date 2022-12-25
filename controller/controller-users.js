const { getUser } = require("../model/model-users")

exports.fetchUser =(req, res, next)=>{

getUser().then(users=>{
    res.status(200).send({users})
   
})
    
}