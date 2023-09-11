const express = require('express');
const app = express();
const route = require('./routes/index')
const port = 4000;

const { errorHandler } = require('./middleware/handleError');

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