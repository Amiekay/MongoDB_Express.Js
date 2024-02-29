const express = require('express');
const {connectToMongoDB} = require('./db');
const app = express()
 require ('dotenv').config()
const PORT = process.env.PORT
const router =require('./routes/bookRoute')

// connecting to mongodb instance
connectToMongoDB()


app.use(express.json())

app.use('/books', router)


app.get('*', (req, res)=>{
    res.send('Welcome')
})


app.listen(PORT, ()=>{
    console.log(`server started susccesfully at http://localhost:${PORT}`)
})


