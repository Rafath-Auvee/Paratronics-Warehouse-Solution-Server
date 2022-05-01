// importing and setup 
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware cors and express json
app.use(cors());
app.use(express.json())

// dotenv code 
require("dotenv").config();

// Port 
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.dgjpm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// client.connect(err => {
//   const data = client.db("Paratronics").collection("products");
//   console.log("DB Connected")
//   client.close();
// });

// app.get("/products", async(req,res)=>{
//   const query = {};
//   const cursor = data.find(query)
//   products = await cursor.toArray();
//   res.send(products)
//   console.log(query)
//   console.log(cursor)
//   console.log(products)
// })


async function run () {
  try{
      await client.connect()
      const data = client.db("Paratronics").collection("products");
      console.log("DB Connected");
      app.get("/products", async(req,res)=>{
      const query = {};
      const cursor = data.find(query)
      products = await cursor.toArray();
      res.send(products)


      console.log(query)
      // console.log(cursor)
      // console.log(products)
    })  
  }
  finally
  {

  }
}

run().catch(console.dir)

app.get("/", (req,res)=>{
  res.send("Paratronics Server is Running");
})

app.listen(port , ()=>{
  console.log(`Port is listening to ${port}`)
})