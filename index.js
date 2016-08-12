var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
var valid_url= require('valid-url');
var ObjectId = require('mongodb').ObjectID;
var shortid = require('shortid');
var express = require('express');
var app = express();


app.get('/:namet',function(req,resp){
    mongo.connect(url, function(err, db) {
 if(err) throw err;
    var uri = req.params.namet;
    console.log(uri);
    var cursor = db.collection('fuck12').find({"_id":uri}).limit(1);
    cursor.each(function(err,doc){
        if(err) throw err;
        console.log(doc);
        if(doc != null)         resp.redirect(doc.old);
    })
    });
});
app.get('/delete/:namet',function(req,resp){
    mongo.connect(url,function(err,db){
        if(err) throw err;
            var uri = req.params.namet;

        var cursor = db.collection('fuck12').find().limit(5);
        cursor.each(function(err,doc){
            if(err) throw err;
            if(doc != null) console.log(doc);
        })
    })
    
    
});
app.get('/new/:namet(*)',function(req,resp,next){
mongo.connect(url, function(err, db) {
 if(err) throw err;
 var uri = req.params.namet;
  var cursor =db.collection('fuck12').find({"old":uri}).limit(1);
  var conta = 0;
   cursor.each(function(err, doc) {
       if(conta ==0){
           conta++;
       
    if(err) throw err;
      if (doc != null) {
          console.log("Doc is not null");
                       resp.end("Error! The url already exist in the archive! identifier    "+doc._id)

    return next(new Error("Error! The url already exist in the archive! identifier"  ));

         
      }      if(!valid_url.isUri(uri)){
console.log("Doc is not a valid url");
          resp.end("Error! The provided url is not valid");
              return next(new Error("Error! The provided url is not valid"  ));

          
          
    } else {
        console.log("Doc is null. A new doc can be inserted");
                 db.collection('fuck12').insert({
                     _id: shortid.generate(),
      "old":uri
    }, function(err, data) {
      // handle error
    if(err){
		
			throw err;
	}
	if(req.params.namet) 	resp.end(JSON.stringify({"old_url":req.params.namet,"new":data.insertedIds[0]}));
      // other operations
    })

      };              
       }         
});

});

});
app.listen(8080);
   
		
			











