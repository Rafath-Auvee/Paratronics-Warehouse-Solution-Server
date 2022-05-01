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

client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log("DB Connected")
  // perform actions on the collection object
  client.close();
});



app.get("/", (req,res)=>{
  res.send("Paratronics Server is Running");
})

app.listen(port , ()=>{
  console.log(`Port is listening to ${port}`)
})