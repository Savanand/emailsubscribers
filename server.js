var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('mongodb://aniket:123@ds031167.mlab.com:31167/emailsubscribers', ['clients']);
var db2 = mongojs('mongodb://aniket:123@ds031167.mlab.com:31167/emailsubscribers', ['lists']);

//var db = mongojs('mongodb://aniket:123@ds031167.mlab.com:31167/emailsubscribers');

var bodyParser = require('body-parser');
//var lists = db.collection('lists');
//var clients = db.collection('clients');
var request= require('request');

app.use(express.static(__dirname + "/public"))
app.use(bodyParser.json());

/* REST calls for clients*/

// get all clients
app.get('/clients', function(req, res){
	console.log("I received a get request for all clients");
		db.clients.find(function(err, docs){
	 	console.log(docs);
	 	res.json(docs);
	 });
});

//get a single client
app.get('/client/:email', function(req, res){
	var email = req.params.email;
	console.log("I received a get request for a client");
			db.clients.find({email: email}, function(err, docs){
	 	console.log(docs);
	 	res.json(docs);
	 });
});

// insert a client
app.post('/client', function(req, res){

	console.log("I received a post/insert request for a new client");
	console.log(req.body);

	db.clients.insert(req.body, function(err, doc){
	res.json(doc);
	 });

});

//delete a client
app.delete('/client/:email', function(req, res){

	console.log("I received a delete request for a client");
	var email = req.params.email;
	console.log(email);
	db.clients.remove({email: email}, function(err, doc){
		res.json(doc);
	 });
});

// edit a client
app.put('/client/:email', function(req, res){

	console.log("I received a edit/put request for an existing client");
	var email = req.params.email;
	console.log(req.body.name);
	console.log(req.body.age);
	console.log(req.body.sex);
	db.clients.findAndModify({query: {email: email},
		update: {$set: {name: req.body.name, age: req.body.age, sex: req.body.sex}},
		new: true}, function(err, doc){
			res.json(doc);
		
 	});
});

/* REST calls for lists*/

// get all lists
app.get('/lists', function(req, res){
	console.log("I received a get request for all lists");
		db2.lists.find(function(err, docs){
	 	console.log(docs);
	 	res.json(docs);
	 });
});

//get a single list
app.get('/list/:list_id', function(req, res){
	var id = req.params.list_id;
	console.log("I received a get request for a single list");
		db2.lists.find({_id: mongojs.ObjectId(id)}, function(err, docs){
	 	console.log(docs);
	 	res.json(docs);
	 });
});

// insert a new list
app.post('/list', function(req, res){

	console.log("I received a post/insert request for a new list");
	console.log(req.body);
	db2.lists.insert(req.body, function(err, doc){
	res.json(doc);
	 });

});

//delete a list
app.delete('/list/:list_id', function(req, res){
	var list_id = req.params.list_id;
	console.log("I received a delete request for a  list");
	console.log(list_id);
	db2.lists.remove({list_id: list_id}, function(err, doc){
		res.json(doc);
	 });
});

// add a subscriber to a list
app.put('/list/:list_id/:email', function(req, res){
	var list_id = req.params.list_id;
	var email = req.params.email;
	
	//console.log(req.body.sub_id);
	//console.log(req.body.sub_date);
	console.log("I received a put request to add a subscriber to a list");
	var currdatetime = Date.now();
	console.log(currdatetime);
	db2.lists.update({_id: mongojs.ObjectId(list_id)},
		{$push: { subscribers: {email: email, sub_date: currdatetime}}}
		,  function(err, doc){
			console.log("inside find and modify");
			res.json(doc);
		
 	});
});

// delete a subscriber from a list
app.delete('/list/:list_id/:email', function(req, res){
	var list_id = req.params.list_id;
	var email = req.params.email;
	db2.lists.update({_id: mongojs.ObjectId(list_id)},
		{$pull: {subscribers: {email: email} } }
		, function(err, doc){
			res.json(doc);
		
 	});
});

//Female subscribers who joined the list after 01/01/2015
//1. find emails with the list joined after 01/01/2015

app.get('/list/:list_id/query1', function(req, res){
	var list_id = req.params.list_id;
	
	var givendatetime = new Date('01/01/2015').getTime();
	console.log(givendatetime);
		

		//db.clients.find( { sex: "female" },
        //         {  $elemMatch: { email: email}  } )


 
		//{subscribers: {sub_date: { $gt: givendatetime } } }
	console.log("I received a get request for query1");
		// db2.lists.find({_id: mongojs.ObjectId(list_id)},
		// 	{subscribers: { "$elemMatch": { sub_date: { "$gte": givendatetime } } } },
		 db2.lists.find({_id: mongojs.ObjectId(list_id)},
			{subscribers: { $elemMatch: { sub_date: { $ge: givendatetime } } } },
		 
		 function(err, docs){
	 	console.log(docs);
	 	res.json(docs);
	 });
});

//Male subscribers who are older than 25 years old
app.get('/list/:list_id', function(req, res){
	var id = req.params.list_id;
	console.log("I received a get request for a single list");
		db2.lists.find({_id: mongojs.ObjectId(id)}, function(err, docs){
	 	console.log(docs);
	 	res.json(docs);
	 });
});
var port = Number(process.env.PORT || 3000);
app.listen(port);
console.log("server listening on" + port);

//app.listen(3000);
//console.log("server running on port 3000");
