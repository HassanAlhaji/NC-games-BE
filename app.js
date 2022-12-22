const { json } = require('express')
const express = require('express')
const app = express()
const {getCategories} = require('./controller/controller-Categories')
const { getComments, postComment } = require('./controller/controller-Comments')
const {getReviews, getReviewById, updateReview} = require('./controller/controller-Reviews')

const { handel404PathError, handelCustomErrors, handel500s } = require('./controller/controllers.erros')
const { fetchUser } = require('./controller/controller-users')
app.use(express.json())
app.get("/api/categories",getCategories )
app.get('/api/reviews',getReviews)
app.get('/api/reviews/:review_id', getReviewById)
app.get('/api/reviews/:review_id/comments', getComments)
app.post("/api/reviews/:review_id/comments", postComment)
app.patch('/api/reviews/:review_id',updateReview)
app.get('/api/users', fetchUser)

app.all("*",handel404PathError)
app.use(handelCustomErrors)
app.use(handel500s)

module.exports = app