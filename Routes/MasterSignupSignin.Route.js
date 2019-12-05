const express = require('express');
var nodemailer = require('nodemailer');
const router = express.Router();
const { MasterAdminSignupSchema } = require('./../Models/MasterAdminSignup.Model');
//const { validateMeChecks } = require('./../middleware')
const { validationResult } = require("express-validator/check");
const { jwtSignin, jwtVerifyToken, validateMeChecks } = require('./../middleware')
const bcrypt = require('bcrypt')
const rounds = 10


// Signup -Registration 
// second method with hash 
router.post('/MasterSignup', validateMeChecks, async function (req, res, next) {


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(200).json({ errors: errors.array({ onlyFirstError: true }) });
    }


    let hashPassword = bcrypt.hashSync(req.body.password, rounds);

    try {
        admin = new MasterAdminSignupSchema({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            company_name: req.body.company_name,
            state: req.body.state,
            city: req.body.city,
            zipcode: req.body.zipcode,
            email: req.body.email,
            password: hashPassword,
            phone_no: req.body.phone_no,
            agreement_policy: req.body.agreement_policy,
        });


        await admin.save();


       
        //sending email from 
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dineout2018@gmail.com',
                pass: 'dineout@2018'
            }
        });
        let href = `http://localhost:3000/API/Signup/verifyEmail/?id=${admin._id}`

        // sending mail to 
        var mailOptions = {
            from: 'dineout2018@gmail.com',
            to: 'Syedhaq5511@gmail.com',// req.body.email
            subject: 'Sending Email using Node.js test mail',
           // text: 'That was easy node class Today!'


            //html for email

            html: `<!DOCTYPE html>
                            <html>
                            <head>
                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                            <style>
                            .card {
                                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                                max-width: 300px;  margin: auto;  text-align: center; font-family: arial;
                            }
                            
                            .title { color: grey;font-size: 18px;
                            }
                            
                            p {
                                border: none; outline: 0;
                                display: inline-block;padding: 8px;
                                color: white;  background-color: #000;text-align: center;
                                cursor: pointer;  width: 100%; font-size: 18px;
                            }
                            
                            button {
                                text-decoration: none;
                                font-size: 22px;
                                color: black;
                            }
                            
                            button:hover, a:hover {
                                opacity: 0.7;
                            }
                            </style>
                            </head>
                            <body>
                            
                            <h2 style="text-align:center">Welcome ${req.body.firstName}</h2>
                            
                            <div class="card">
                                <img src="https://www.w3schools.com/w3images/team2.jpg" alt="John" style="width:100%">
                                <h1>${req.body.firstName}</h1>
                                <p class="title">Thanku.</p>
                            
                                <button><a href=${href} active">Verify Email</a></button>
                            </div>
                            
                            </body>
                        </html>`

        };

        //sending email method or function
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


        return res.status(200).send({ response: admin, 'route': 'https://yahoo.com' });


    } catch (error) {
        let str = `E11000 duplicate key error collection: test.masteradminsignups index`

        if (error.name === 'MongoError' && error.code === 11000) {
        let ermsg = error.errmsg.replace(str, `Duplicate key `).replace(/[':'",.<>\{\}\[\]\\\/]/gi, "").replace('dup key', '').replace('_1',' :')            
        console.log(error,"-------",ermsg)   
        return res.status(200).json({ errors:[{'msg':ermsg}] });
        } else {
            next(error);
        }
    }

});





// First method old with out hash 
// signup 

router.post('/MasterSignup1',validateMeChecks,async function(req, res, next) {
    console.log(req.body)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
       
        return res.status(200).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    let admin = await MasterAdminSignupSchema.findOne({ email: req.body.email},{phone_no:req.body.phone_no });

    

    if (admin) {

        return res.status(200).json({ errors: [{'msg':'This email already exit'}, {'msg':'this phone already exit'}] });

    } else {

        try {
            admin = new MasterAdminSignupSchema({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                company_name: req.body.company_name,
                state: req.body.state,
                city: req.body.city,
                zipcode: req.body.zipcode,
                email: req.body.email,
                password: req.body.password,
                phone_no: req.body.phone_no,
                agreement_policy: req.body.agreement_policy,
            });

            await admin.save();


            //return res.status(200).send({admin:admin,message:"data inserted"});


            //sending email from 
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dineout2018@gmail.com',
                    pass: 'dineout@2018'
                }
            });

            // sending mail to 
            var mailOptions = {
                from: 'dineout2018@gmail.com',
                to: 'Syedhaq5511@gmail.com',// req.body.email
                subject: 'Sending Email using Node.js test mail',
                text: 'That was easy node class Today!'
            };

            //sending email method or function
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });


            return res.status(200).send({ response: admin, 'route': 'https://yahoo.com' });

        } catch (err) {
            return next(err)
        }
    } 
});





//Signin
// This below API is to signin to masterAdmin portal 
// This API will generate JWT token when on successful sign in 

//validateMeChecks

router.post('/Signin',validateMeChecks,async (req, res, next) => {

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(200).json({ errors: errors.array({ onlyFirstError: true }) });
    }


    // Check if this user already exisits
    let admin = await MasterAdminSignupSchema.findOne({ email: req.body.email, status: true });
    if (admin == null) {

        return res.status(200).json({ errors:[{"msg": 'That admin dose not exisits! Or deactivated, Please check login details' }]});

    }
    let compPassword = bcrypt.compareSync(req.body.password, admin.password)

    if (compPassword == false) {

        return res.status(200).json({ errors:[{"msg": 'That admin dose not exisits! Or deactivated, Please check login details' }]});

    } else {

        let adminId = admin._id

        try {

            let token = jwtSignin(req, res, next, { adminId: adminId })

            res.status(200).send({ auth: true, token: token, admin });

        } catch (err) {
            return next(err)
        }
    }
});





router.get('/verifyEmail', async (req, res, next) => {


    // Check if this user already exisits
    if (req.query.id !== "") {
        try {

            let admin = await MasterAdminSignupSchema.findOneAndUpdate({ _id: req.query.id }, { status: true })


            res.status(200).send({ auth: true, admin });

        } catch (err) {
            return next(err)
        }
    } else {
        res.status(200).send({ "error": 'Something is missing.' });
    }


});




module.exports = router;










 