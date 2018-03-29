var express = require('express');

var app = express();


app.listen(3000, err=>{
    if(err) throw err;
    console.log("Server is runnong");
});