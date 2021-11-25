const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wu3dk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run(){
	try{

		await client.connect();
		const database = client.db('holiday');

		const packagescollection = database.collection('packages');

		const orderscollection = database.collection('orders');

		//GET API - ALL PACKAGES
		app.get('/new_package',async(req , res)=>{
			const cursor = packagescollection.find({});
			const packages = await cursor.toArray();
			res.send(packages);
		})

		//GET API - ORDERS
		app.get('/place_order',async(req , res)=>{
			const cursor = orderscollection.find({});
			const orders = await cursor.toArray();
			res.send(orders);
		})


		//POST API 
		app.post('/new_package', async(req , res)=>{
			const package = req.body;
			
			const result = await packagescollection.insertOne(package);

			console.log(result);
			res.json(result);

		});

		//POST API - NEW ORDER

		app.post('/place_order/:orderId', async(req , res) =>{
			const orders = req.body;
			console.log('test: ',req.body);
			const result = await orderscollection.insertOne(orders);

			console.log(result);
			res.json(result);

		} );

		//DELETE API - SINGLE ORDER DELETE

		app.delete('/place_order/:id', async(req , res)=>{
			const id = req.params.id;
			const query = {_id:ObjectId(id) };
			const result = await orderscollection.deleteOne(query);
			console.log('Deleting this ID: ', id);


			res.json(result);

		});


	}

	finally{
		// await client.close();
	}
}
 
run().catch(console.dir);



app.get('/',  (req, res)=>{
	res.send('Holiday Server is running');
} );


app.listen(port, () => {
	console.log('Listening on port: ', port);
})