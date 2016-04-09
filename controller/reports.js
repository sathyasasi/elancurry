var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require("body-parser");
var restify = require('restify');
var bunyan = require('bunyan');
var loadash = require('lodash');
var Purchase = require('../models/purchase.js');
var Response = require('../helpers/response.js');
var error = require('../helpers/errors.js');
var common = require('../helpers/common.js');
var mail = require('../helpers/mail.js');


//adding sales details
exports.addpurchase = function(req, res, next){
var purchase = new Purchase(req.body);
var phone = req.body.phone;

   Purchase.find({"phone": phone}, function(err, menu){
    if(menu != null && menu != ""){
       if(err) return next(err);
    res.send(400,{purchase:'already exists phone number'});
    }
else{
  purchase.save(function(err, purchase) {
  console.log("sales details added");
   res.send(200,{purchase: purchase});
   console.log(purchase);
  return next();
 });
}
 });
}

//View Individual purchase record
exports.viewuserPurchase = function(req, res, next){
var id = req.params.id;
Purchase.findById(id,function(err,purchase){
  if(purchase !=null && purchase != "")
  {
    if(err) return next(err);
    res.send(200,{purchase: purchase});
    return next();
  }
  else{
    res.send(400,{purchase:'Not exist purchase'});
    return next();
  }

});
}


//purchase history
exports.viewdatelist = function(req, res, next){
 var date = req.body.date;
 //var userpurchaseid = req.body.userpurchaseid;
 console.log(date);
 //console.log(userpurchaseid);
 Purchase.aggregate([
   {
     $match :
     {
     "date" : date
     //"userpurchaseid" : userpurchaseid
   }
   },
   /*{
     $unwind: "$userpurchase",
   },
   {
      $project: {
        "purchaseid": "$_id",
        "userpurchaseid": "$userpurchase._id",
        "curryName": "$userpurchase.curryName",
        "curryType": "$userpurchase.curryType",
        "Buyquantity": "$userpurchase.Buyquantity",
        "amount": "$userpurchase.amount",
        "oderRequestdate": "$userpurchase.oderRequestdate"
      }
    },*/
   {
     $limit: 20
   },
   {$sort :{
     'oderRequestdate': -1
    }}],function(err, purchase){
 if(err) return next(err);
if(purchase)
 //if(purchase != '' && purchase != null)
 {
   console.log(purchase);
   res.send(200,{ purchase});
   console.log("purchase detail found");
 }
 else {
   res.send(400,{purchase:'purchase details not found'});
   console.log("purchase details not found");
 }
});
}



/*exports.viewdatelist = function(req,res,next){
var purchaseid = req.body.purchaseid;
console.log("purchaseid");
//var commodityId = req.body.commodity;

Purchase.find({
  'purchaseid':purchaseid,
//  'commodityId':commodityId
}, 'purchaseid customerName phone deliveryAddress userpurchase',
{
  limit: 10,
  sort:{
        'oderRequestdate': -1 //Sort by Date Added DESC
    }
}, function(err, purchase){
  if(err){
    res.send(400,{purchase:'error looking up for purchase history'});
    return next();
  } else if(!purchase){
    res.send(400,{purchase:'No purchase found'});
    return next();
  } else {
    console.log("got1");
    //res.send(JSON.stringify(purchase));
    res.send(200,{purchase: purchase});
    //res.send(purchase);
    return next();
  }
});

}*/
