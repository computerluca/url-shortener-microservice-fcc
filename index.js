"use strict"
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
var valid_url = require('valid-url');
var shortid = require('shortid');
var express = require('express');
var app = express();

app.get('/', function(req, resp) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var cursor = db.collection('link').find();
        var result = "<!doctype html><html><head>URLShortener Home page</head><body><h1>In this page you can see the urls have already been shortened using this service<ul>";

        cursor.toArray(function(err, doc) {
            if (err) throw err;
            for (var i = 0; i < doc.length; i++) {
                result += "<li>Old url  => " + doc[i].old + "new url=>" + doc[i]._id;
            }
            resp.end(result);
        });



    })
});
app.get('/:namet', function(req, resp) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var uri = req.params.namet;
        console.log(uri);
        var cursor = db.collection('link').find({
            "_id": uri
        }).limit(1);
        cursor.each(function(err, doc) {
            if (err) throw err;
            console.log(doc);
            if (doc != null) resp.redirect(doc.old);
            else {
                resp.end("The url doesn't exist");
            }
        })
    });
});
app.get('/delete/:namet', function(req, resp) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var uri = req.params.namet;
        var find = db.collection('link').findOne({
                _id: uri
            },
            function(err, data) {
                if (err) throw data;
                if (!data) {
                    resp.end("Link doesn't exists");
                }
                else {
                    var cursor = db.collection('link').deleteOne({
                            _id: uri
                        },
                        function(err, results) {
                            if (err) throw err;
                            resp.end("Link delete successfully");
                        });
                }
            });



    })


});
app.get('/new/:namet(*)', function(req, resp, next) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var uri = req.params.namet;
        var cursor = db.collection('link').find({
            "old": uri
        }).limit(1);
        var count = 0;
        cursor.each(function(err, doc) {
            if (count == 0) {
                count++;

                if (err) throw err;
                if (doc != null) {
                    console.log("Doc is not null");
                    resp.end("Error! The url already exist in the archive! identifier    " + doc._id)

                    return next(new Error("Error! The url already exist in the archive! identifier"));


                }
                if (!valid_url.isUri(uri)) {
                    console.log("Doc is not a valid url");
                    resp.end("Error! The provided url is not valid");
                    return next(new Error("Error! The provided url is not valid"));



                }
                else {
                    console.log("Doc is null. A new doc can be inserted");
                    db.collection('link').insert({
                        _id: shortid.generate(),
                        "old": uri
                    }, function(err, data) {
                        // handle error
                        if (err) {

                            throw err;
                        }
                        if (req.params.namet) resp.end(JSON.stringify({
                            "old_url": req.params.namet,
                            "new": data.insertedIds[0]
                        }));
                        // other operations
                    })

                };
            }
        });

    });

});
app.listen(8080);
