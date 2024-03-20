const express = require('express');
const router = express.Router();
const bookModel = require('../model/books')
// CRUD ROUTE

 router.post('/', (req, res)=>{
const book = req.body

bookModel.create(book)
.then(()=>{
    res.status(200).send('books created successfully' )
})
.catch((err)=>{
    res.status(400).send({
        message: 'an error occured',
        data: err}
    )
})
console.log(book)
})

router.get('/', (req, res)=>{
 bookModel.find({})
 .then((books)=>{
    res.render('books', {books, user: req.user})
 })
 .catch((err)=>{
    res.status(400).send(err)
 })

})


router.get('/:id', (req, res)=>{
    const id = req.params.id
bookModel.findById(id)
.then((book)=>{
   
    res.render('book',{})
})
.catch((err)=>{
    res.status(400).send(err)
 })
})

router.put('/:id', (req, res)=>{
const id = req.params.id
const body = req.body
    bookModel.findByIdAndUpdate(id, body)
    .then(()=>{
        res.status(200).send('books updated successfully' )

    })
.catch((err)=>{
    res.status(400).send(err)
 })
})

router.delete('/:id', (req, res)=>{
const id = req.params.id
bookModel.findByIdAndDelete(id)
.then(()=>{
    res.status(200).send('book deleted successfully' )

})
.catch((err)=>{
res.status(400).send(err)
})

})

module.exports=
    router
