require('dotenv').config()
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// mongo connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z8yqdyj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const dbConnect = async () => {
    try {
        client.connect();
        console.log("Database Connected Successfully✅");

    } catch (error) {
        console.log(error.name, error.message);
    }
}
dbConnect()


const menuCollection = client.db("mernDb").collection("menu2");
const reviewsCollection = client.db("mernDb").collection("reviews2");
const cartsCollection = client.db("mernDb").collection("carts2");

app.get('/menu', async (req, res) => {
    const result = await menuCollection.find().toArray();
    res.send(result);
})
app.get('/review', async (req, res) => {
    const result = await reviewsCollection.find().toArray();
    res.send(result);
})

// cart collections
//  create cart
app.post('/carts', async (req, res) => {
    const item = req.body;
    console.log(item);
    const result = await cartsCollection.insertOne(item);
    res.send(result);
})
// get cart
app.get('/carts', async (req, res) => {
    const email = req.query.email;

    if (!email) {
        res.send([])
    }

    const query = { email: email };
    const result = await cartsCollection.find(query).toArray()
    console.log(result, query);
    res.send(result);

})
// delete cart
app.delete('/carts/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await cartsCollection.deleteOne(query)
    res.send(result);
})









app.get('/', (req, res) => {
    res.send('mern is ok!')
})

app.listen(port, () => {
    console.log('mern running well');
})