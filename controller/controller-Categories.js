const {fetchCategories} = require('../model/model-Categories')

exports.getCategories = (req, res, next)=>{
    fetchCategories().then((categories)=>{
        res.status(200).send({categories})
    })
}
