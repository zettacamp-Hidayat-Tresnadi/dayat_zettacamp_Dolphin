const express = require('express');
const app = express();
const route = require('./routes/index')
const port = 4000;
const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/"
const database = "book-Purchasing-Test"

const { errorHandler } = require('./middleware/handleError');

mongoose.connect(`${url}${database}`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

.then(()=>{
    console.log('Connected to MongoDB version 4.4.24')
})
.catch((error)=>{
    console.log(error)
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', route);
app.use('*', function(_){
    throw {name:'Not Found'}
});
app.use(errorHandler)


app.listen(port, function (err) {
    console.log("Server listening on PORT", port);
});