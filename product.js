const mongoose = require('mongoose');

const Schema = mongoose.Schema


const productSchema = mongoose.Schema({
   title: {
       type: String,
       maxlength: 50
   },
   description: {
       type: String
   }
}, { timestamps: true })

productSchema.index({
    title: 'text',
}, {
    weights: {
        title: 1
    }
})



const Product = mongoose.model('Product', productSchema);

module.exports = { Product }