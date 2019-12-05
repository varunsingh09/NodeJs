const mongoose = require('mongoose');
mongoose.set('debug', true)

// This schema is creating master admin account in database collection [MasterAdminSignup]


const MasterAdminSignupSchema = mongoose.model('MasterAdminSignup', new mongoose.Schema ({

    firstName:{type:String, maxlength:25,required:true,trim:true},
    lastName:{type:String, maxlength:25,required:true,trim:true},
    company_name:{type:String, maxlength:25,required:true,trim:true},
    state:{type:String, required:true},
    city:{type:String,required:true},
    zipcode:{type:Number, required:true},
    email:{type:String,required:true,unique:true,trim:true},
    password:{type:String,minlength:4,maxlength:250,required:true,trim:true},
    phone_no:{type:Number,minlength:1,maxlength:10,required:true,unique:true,trim:true},
    agreement_policy:{type:String,required:true},
    status:{type:Number,default:false},
    create_at : { type: Date, required: true, default: Date.now }


}))

exports.MasterAdminSignupSchema = MasterAdminSignupSchema;