const jwt = require('jsonwebtoken')
var config = require('./config');
const { check } = require('express-validator/check');



//use for uplaod image
const multer = require('multer');
//end here====
//use for uplaod image




// Multer use for image upload set image directory location
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})





module.exports = {
    jwtVerifyToken: function (req, res, next) {
        //console.log('come inside verify token' , req)
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
        
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            return next();
        });

    },

    jwtSignin: function (req, res, next, { userId }) {
        //console.log("come",userId)

        var token = jwt.sign({ id: userId }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        next();
        return token

    },
    upload: multer({ storage: storage }),


    // Validation middleware check method for validation 
    validateMeChecks: [
        check('email','Email is required.').not().isEmpty().isEmail().withMessage('Please check email.'),
        //check('email').not().isEmpty().withMessage('Can not levave black').isEmail('Wrong email format'),
        //isLength({ min: 3, max: 50 }).withMessage('Name length in between 3 to 50 chars'),
        check('password').not().isEmpty().withMessage('Can not levave black')

    ],
    
}


