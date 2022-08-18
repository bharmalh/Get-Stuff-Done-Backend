const express = require('express');
const app = express();
const PORT = 2121;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

let db;
let dbConnectionStr = process.env.DB_STRING;
let dbName = 'get-stuff-done-db';

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
	(client) => {
		console.log('Connected to Database Succesfully');
		db = client.db(dbName);
	}
);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (request, response) => {
	db.collection('todolist')
		.find()
		.toArray()
		.then((data) => {
			db.collection('todos')
				.countDocuments({ todoDone: false })
				.then((itemsLeft) => {
					response.render('index.ejs', {
						items: data,
						left: itemsLeft,
					});
				});
		})
		.catch((error) => console.log(error));
});

app.listen(process.env.PORT || PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
