// importing and setup
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
// Middleware cors and express json
app.use(cors());
app.use(express.json());
// dotenv code
require("dotenv").config();
// Port
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.dgjpm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const data = client.db("Paratronics").collection("products");
    console.log("DB Connected");
    // all product
    app.get("/inventory", async (req, res) => {
      const query = {};
      // console.log(">>>>>>>>>>>>>>>>>>")
      // const email = req.query.email;
      // console.log(email);
      const cursor = data.find(query);
      products = await cursor.toArray();
      res.send(products);
      // console.log(query)
    });

    //finding my items thorugh my email address

    app.get("/myitems", async (req, res) => {
      const email = req.query.email;
      const quantity = req.body;
      console.log(">>>>>>>");
      console.log(req.query);
      console.log(">>>>>>>");
      console.log(email);
      console.log(">>>>>>>");
      console.log(quantity);
      const query = { email: email };
      const cursor = data.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // single product
    app.get(`/inventory/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await data.findOne(query);
      res.send(product);
    });

    //delete product

    app.delete(`/inventory/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await data.deleteOne(query);
      res.send(result);
    });

    //adding product
    app.post("/inventory", async (req, res) => {
      const newProduct = req.body;
      console.log(`newProduct added ${newProduct}`);
      const product = await data.insertOne(newProduct);
      res.send(product);
    });

    // add+ deliver product
    app.put(`/inventory/:id`,async(req,res)=>{
      const id=req.params.id
      const updatedProduct=req.body
      const filter ={_id:ObjectId(id)}
      const options = { upsert: true }
      const updatedDoc={
        $set:{
          quantity: updatedProduct.quantity
        }
      }
      const result=await data.updateOne(filter,updatedDoc,options)
      res.send(result)
    })

  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Paratronics Server is Running");
});

app.listen(port, () => {
  console.log(`Port is listening to ${port}`);
});
