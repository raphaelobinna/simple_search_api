const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')
const { Product } = require("./product");
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());

const connect = mongoose.connect(`mongodb+srv://search:search@cluster0.j5xcf.mongodb.net/product?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true, useUnifiedTopology: true,
        useCreateIndex: true, useFindAndModify: false
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use(cors())

app.post("/uploadProduct", (req, res) => {
    const { title, description } = req.body

    const product = Product.create({
        title,
        description,
    })
    res.status(200).json({ success: true })

});


app.post("/getProducts", (req, res) => {

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);

    let term = req.body.searchTerm


        Product
            .find({ title: { $regex: term, $options: "i" } })
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, products, PostSize: products.length })
            })



});

app.post("/getAll", (req, res) => {


        Product
            .find()
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, products, PostSize: products.length })
            })



});

app.get("/", function (req, res) {
    res.send("<h1>Hello World!</h1>")
  })

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server Listening on ${port}`)
});