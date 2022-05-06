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

    app.get("/myitem", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const cursor = data.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // single product
    app.get(`/inventory/:id`, async (req, res) => {
      const id = req.params.id;
      console.log(">>>>>>>>>>>>>>>>>>");
      console.log(req);
      console.log(">>>>>>>>>>>>>>>>>>");
      console.log(req.params);
      console.log(">>>>>>>>>>>>>>>>>>");
      console.log(req.params.id);

      const query = { _id: ObjectId(id) };
      const product = await data.findOne(query);
      // console.log(product);
      res.send(product);
    });

    //adding product
    app.post("/inventory", async (req, res) => {
      const newProduct = req.body;
      console.log(`newProduct added ${newProduct}`);
      const product = await data.insertOne(newProduct);
      res.send(product);
    });
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
