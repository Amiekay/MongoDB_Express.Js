const express = require('express');
const app = express()
const router = express.Router();
const userModel = require('../model/users')

app.use(express.json())

router.post('/', (req, res, next)=>{
const user = req.body
     userModel.create(user)
     .then(()=>{
         res.status(200).send('signed up successfully' )
     })
     .catch((err)=>{
         res.status(400).send({
             message: 'an error occured',
             data: err}
         )
     })
  next()  
} )




module.exports = router