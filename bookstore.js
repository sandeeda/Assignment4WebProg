var express = require('express');
var mongoose = require('mongoose');
var app = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)

var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

mongoose.connect(database.url);

var Book = require('./models/book');

//Add express handlebar
const exphbs = require('express-handlebars');
const fs = require('fs');


const HBS = exphbs.create({
    //Create custom HELPER
    layoutsDir: "views/layouts", 
    partialsDir: "views/partials",
    helpers: {
        checkOutOfStock : function(stock){
            if(stock == 0)
                return "Out of stock";
            else
                return stock;
        },
        setRowColor : function(stock){
            if (stock == 0)
                return "style='background-color:#e7b4b4'";
        },
        checkAuthorAvailable(author){
            if(author!=""){
                return true;
            }
        }
    }
});
//app.engine('.hbs', exphbs.engine({ extname: 'hbs' }))
app.engine('.hbs', HBS.engine)
app.set('view engine', '.hbs')



//get all book data from db
app.get('/api/books',async function (req, res) {
	// use mongoose to get all books in the database
	Book.find(function (err, books) {
		// if there is an error retrieving, send the error otherwise send data
		if (err)
			res.send(err)
		//res.json(books); // return all books in JSON format
		var allBooks = JSON.stringify(books);
		res.render('listOfBooks', {books:JSON.parse(allBooks)});

	});
});

app.route('/api/books/new')
.post(function (req, res) {

	// create mongose method to create a new record into collection
	console.log(req.body);

	Book.create({
		ISBN: req.body.ISBN,
		img: req.body.img,
		title: req.body.title,
		author: req.body.author,
		category: req.body.category
	}, function (err, book) {
		if (err)
			res.render('confirmDataLoaded',{message:err});

		// get and return all the employees after newly created employe record
		Book.find({ ISBN: req.body.ISBN }, function (err, book) {
			if (err) {
				res.render('confirmDataLoaded',{message:err});
			}
			else {
				//console.log(book);
				res.render('confirmDataLoaded',{message:req.body.title+" has been added to our store"});
			}
		})
	});

})
.get(function(req,res){
	res.render('insertBook');
})

// get a book by ID or ISBN
app.get('/api/books/:primary_key', function (req, res) {
	let id = req.params.primary_key;
	if (mongoose.Types.ObjectId.isValid(id)) {
		Book.findById(id, function (err, book) {
			if (err) {
				res.send(err)
			}

			res.json(book);
		});
	}
	else {
		Book.find({ ISBN: id }, function (err, book) {
			if (err) {
				res.send(err);
			}
			else {
				res.json(book);
			}
		})
	}


});


// // create book and send back that book after creation
// app.post('/api/books', function (req, res) {

// 	// create mongose method to create a new record into collection
// 	console.log(req.body);

// 	Book.create({
// 		ISBN: req.body.ISBN,
// 		img: req.body.img,
// 		title: req.body.title,
// 		author: req.body.author,
// 		category: req.body.category
// 	}, function (err, book) {
// 		if (err)
// 			res.send(err);

// 		// get and return all the employees after newly created employe record
// 		Book.find({ ISBN: req.body.ISBN }, function (err, book) {
// 			if (err) {
// 				res.send(err);
// 			}
// 			else {
// 				res.json(book);
// 			}
// 		})
// 	});

// });


// update book and send back book after creation
app.put('/api/books/:primary_key', function (req, res) {
	// create mongose method to update an existing record into collection
	console.log(req.body);

	let id = req.params.primary_key;
	var data = {
		title: req.body.title,
		inventory: req.body.inventory,
	}

	// save the user
	if (mongoose.Types.ObjectId.isValid(id)) {

		Book.findByIdAndUpdate(id, data, function (err, book) {
			if (err) throw err;

			res.send('Successfully! Book updated - ' + book.title);
		});
	}
	else{
		Book.findOneAndUpdate({ISBN:id}, data, function (err, book) {
			if (err) throw err;

			res.send('Successfully! Book updated - ' + book.title);
		});
	}
});

// delete a book by id
app.delete('/api/books/:primary_key', function (req, res) {
	console.log(req.params.primary_key);
	let id = req.params.primary_key;
	if (mongoose.Types.ObjectId.isValid(id)) {
		Book.remove({
			_id: id
		}, function (err) {
			if (err)
				res.send(err);
			else
				res.send('Successfully! Book has been Deleted.');
		});
	}
	else {
		Book.remove({ ISBN: id }).then((result) => {
			res.send("'Successfully! Book has been Deleted.'");
		});
	}
});





app.listen(port);
console.log("App listening on port : " + port);
