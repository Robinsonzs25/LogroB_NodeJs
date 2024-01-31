const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const { request } = require('http');
const Swal = require('sweetalert2');

var bodyParser  = require("body-parser");

app.set('view engine', 'ejs');
app.use(expressLayouts)
app.use(express.urlencoded({extended:false}));
app.use(express(express.json));
app.use(express.static(path.join(__dirname, 'public')))


const router = require('./routes/router')
app.use(router.routes)

app.listen(5000, ()=>{
    console.log('Server corriendo en http://localhost:5000');
});