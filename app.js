const { json } = require('express')
const express = require('express')
const app = express()
const {getCategories} = require('./controller/controller-getCategories')
const { getComments } = require('./controller/controller-getComments')
const {getReviews, getReviewById} = require('./controller/controller-getReviews')
const { handel404PathError, handelCustomErrors, handel500s } = require('./controller/controllers.erros')
app.use(express.json())
app.get("/api/categories",getCategories )
app.get('/api/reviews',getReviews )
app.get('/api/reviews/:review_id', getReviewById)
app.get('/api/reviews/:review_id/comments', getComments)













app.all("*",handel404PathError)
app.use(handelCustomErrors)
app.use(handel500s)

module.exports = app