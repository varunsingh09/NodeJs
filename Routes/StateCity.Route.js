const express = require('express');
const router = express.Router();
const { StateCitySchema } = require('./../Models/StateCity.Model');
const path = require('path');
const fs = require('fs')
var ObjectId = require('mongodb').ObjectID



async function  AddtoDb(StateName,cityListdata)
{
    var cityData = { 
        state:StateName,
        cityList: cityListdata
   };
  console.log(cityData);
  var id = cityData._id;
  
  var userCrendatialToUpdate = {};
  userCrendatialToUpdate = Object.assign(userCrendatialToUpdate, cityData);
  delete userCrendatialToUpdate._id;
  console.log(userCrendatialToUpdate);
  var query = { '_id': ObjectId(id) };
 var x= await StateCitySchema.findOneAndUpdate(query, userCrendatialToUpdate, { upsert: true });
  console.log(x);
}


router.get('/readJsonFile', async (req,res) => {

//exports.readJsonFile =async function (req, res) {
    var directoryName = __dirname;
    let reqPath = path.join(__dirname, '../data.json');

    var objJson = await JSON.parse(fs.readFileSync(reqPath, 'utf8'));
    for (var key in objJson) {
        if (objJson.hasOwnProperty(key)) {
           await AddtoDb(key,objJson[key])
        }
    };
     res.send("saved.");
});



// This will fetch all state & city from mongo database schema 
router.get('/AllStateCity', async (req,res)=>{
    console.log(req.body);
  
    await StateCitySchema.find({}).exec(function (err, list) {

    if(err){ res.status(500).send(err);

    }else {if(list.length==0)
    {
        res.status(200).send("No  Record Found");
  }
        if(list.length>0)
  {
    res.status(200).send(list);
  }
    }
   
})
});


module.exports = router;