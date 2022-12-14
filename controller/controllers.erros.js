const handel404PathError =(req, res, next)=>{
    res.status(404).send({msg:'path NOT found'})
}

const handelCustomErrors =(err, req, res, next)=>{
    if(err.status && err.msg){
        res.status(err.status).send({msg:err.msg})
    }else{
        next(err)
    }
}
const handel500s = (err, req, res, next)=>{
console.log(err);
res.status(500).send({msg:'server error'})
}

module.exports = {handel404PathError, handelCustomErrors, handel500s}