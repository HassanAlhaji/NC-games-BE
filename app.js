const express = require('express')
const app = express()
const {getCategories} = require('./controller/controller-getCategories')
const {getReviews} = require('./controller/controller-getReviews')

app.get("/api/categories",getCategories )
app.get('/api/reviews',getReviews )



app.all("*", (req, res) => {
    res.status(404).send({ msg: 'path not found' });
  });

module.exports = app