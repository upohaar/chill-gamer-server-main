const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port= process.env.PORT || 5000
require('dotenv').config()

// middleWare

app.use(cors())
app.use(express.json())

const uri = `${process.env.DATABASE}`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }

});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   
    const database = client.db("GamerBD");
    const gameCollection= database.collection("gamer");

    const userReviews= database.collection("review");

    // userReview
    app.post('/userReview',async(req,res)=>{
      const userReview= req.body;
      console.log(userReview);
      const result = await userReviews.insertOne(userReview);
      res.send(result)
      
    })
    app.get('/userReview',async(req,res)=>{
      const cursor = userReviews.find();
      const result=await cursor.toArray();
      res.send(result)
    })

    // create
    app.post('/reviews',async(req,res)=>{
      const newReview= req.body;
      console.log(newReview);
      const result = await gameCollection.insertOne(newReview);
      res.send(result)
    })
   

    // read
    app.get('/review',async(req,res)=>{
      const query= req.query.sort
      if (query== "rating") {
        const cursor = gameCollection.find().sort({"rating":1});
      const result=await cursor.toArray();
      res.send(result)
      }
      else if (query== "year") {
        const cursor = gameCollection.find().sort({"year":1});
      const result=await cursor.toArray();
      res.send(result)
      }
      else{
        const cursor = gameCollection.find();
      const result=await cursor.toArray();
      res.send(result)
      }
      
    })
    app.get('/reviews',async(req,res)=>{
      const cursor = gameCollection.find().limit(6);
      const result=await cursor.toArray();
      res.send(result)
    })
    // Delete
    app.delete('/review/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id) };
      const result = await gameCollection.deleteOne(query);
      res.send(result)
    })
    // Update
    app.get('/review/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id) };
      const result = await gameCollection.findOne(query);
      res.send(result)
    })
    app.put('/review/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const filter = {_id: new ObjectId(id) };
      const options = { upsert: true };
      const updateReview=req.body;
      console.log(updateReview);
      const Review = {
        $set: {
          photo:updateReview.photo,
          name:updateReview.name,
          description:updateReview.description,
          year:updateReview.year,
          genres:updateReview.genres,
          rating:updateReview.rating,
        
        },
      };
      const result = await gameCollection.updateOne(filter, Review, options);
      res.send(result)
    
    })


  

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Chill Gamer Server')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })