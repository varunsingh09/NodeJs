const express = require('express')
const app = express()
var morgan = require('morgan')
var cors = require('cors')
const port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
const session = require('express-session')


require('./db')
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false }))
app.use(bodyParser.json());
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
app.use(cors()); // cros is for cross orgin resouce for issue with front end backend ports



// SignUP - Api Route 
const MSignup = require('./Routes/MasterSignupSignin.Route')
app.use('/API/Signup',MSignup)
// Post  - /API/Signup/MasterSignup'



// Signin - Api Route 
const MLogin = require('./Routes/MasterSignupSignin.Route')
app.use('/Api',MLogin)
// Post  - /Api/Signin




// State and City Api Route 
const StateCity = require ('./Routes/StateCity.Route')
app.use('/StateCity', StateCity)
// Get - /StateCity/readJsonFile






//This below code is to display error if anyone typed wrongURL extenstion 
/*
app.use(function (req, res, next) {
  var err = new Error('We think you are lost, you might typed wrong URL!');
   err.status = 404;
  return next(err);
});

*/


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
