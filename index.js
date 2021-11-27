const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qcalb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('appartmentDb');
        const articleCollection = database.collection('articles');
        const productCollection=database.collection('products');
        const orderCollection=database.collection('orders');
        const reviewsCollection=database.collection('reviews');
        const usersCollection=database.collection('users');
        console.log("DB Connected");

        //get Api For Articles
        app.get('/articles', async (req, res) => {
            const cursor = articleCollection.find({});
            const articles = await cursor.toArray();
            res.json(articles);
        })

        //Get Single Articles
        app.get('/articles/:id',async(req,res)=>{
            const id=req.params.id;
            //console.log(id);
            const query={_id:ObjectId(id)};
            const article=await articleCollection.findOne(query);
            res.json(article);
        })

        //post api for Products
        app.post("/products",async(req,res)=>{
            const products=req.body;
            const result=await productCollection.insertOne(products);
            res.json(result)
        })

        //get Api For Products
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        })
        //Get Api Single Products
        app.get('/products/:id',async(req,res)=>{
            const id=req.params.id;
            //console.log(id);
            const query={_id:ObjectId(id)};
            const result=await productCollection.findOne(query);
            res.json(result);
        })

        //Delete An Order From Orders
        app.delete('/products/:id',async(req,res)=>{
            const id=req.params.id;
            console.log("Deleting Order With Id",id);
            const query={_id:ObjectId(id)}
            const result=await productCollection.deleteOne(query)
            res.json(result);       
        })
    
        //get Api For Reviews
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })
         //post api for ReviewSubmission
         app.post("/review",async(req,res)=>{
            const reviews=req.body;
            console.log(reviews);
            const result=await reviewsCollection.insertOne(reviews);
            res.json(result)
        })

        //get all orders
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });

        //get Api For Orders
        app.get('/orders', async (req, res) => {
            const email=req.query.email;
            const query={email:email}
            const cursor = orderCollection.find(query);
            const result = await cursor.toArray();
            res.json(result);
        });


        //post api for order
        app.post("/orders",async(req,res)=>{
            const orders=req.body;
            const result=await orderCollection.insertOne(orders);
            res.json(result)
        });

        //Delete An Order From Orders
        app.delete('/orders/:id',async(req,res)=>{
            const id=req.params.id;
            console.log("Deleting Order With Id",id);
            const query={_id:ObjectId(id)}
            const result=await orderCollection.deleteOne(query)
            res.json(result);

        })

        
        //post User Api
        app.post('/users',async(req,res)=>{
            const  user=req.body;
            const result=await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        //Get Users Api
        app.get("/users/:email",async(req,res)=>{
            const email=req.params.email;
            const query={email:email};
            const user=await usersCollection.findOne(query);
            let isAdmin=false;
            if(user?.role==='admin'){
                isAdmin=true;
            }
            res.json({admin:isAdmin});
        })


        
        //admin role
        app.put('/users/admin',async(req,res)=>{
            const user=req.body;
            console.log("PUT",user);  
            const filter={email:user.email};
            const updateDoc={$set: { role:'admin'}};
            const result=await usersCollection.updateOne(filter,updateDoc);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("Appartment Server");
})

app.listen(port,()=>{
    console.log("Appartment Server on Port",port)
})