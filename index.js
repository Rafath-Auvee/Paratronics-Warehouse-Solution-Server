// importing and setup
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require('jsonwebtoken');
// Middleware cors and express json
app.use(cors());
app.use(express.json());
// dotenv code
require("dotenv").config();
// Port
const port = process.env.PORT || 6500;

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log(authHeader, req.headers.authorization)
  if (!authHeader) {
      return res.status(401).send({ message: 'unauthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
          return res.status(403).send({ message: 'Forbidden access' });
      }
      console.log('decoded', decoded);
      req.decoded = decoded;
      next();
  })
}


const uri = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.dgjpm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    // await client.connect();
    const data = client.db("Paratronics").collection("products");
    console.log("DB Connected");
    // all product
    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = data.find(query);
      products = await cursor.toArray();
      res.send(products);
    });

    //finding my items thorugh my email address

    // AUTH
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });

    app.get("/myitems", verifyJWT, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
      console.log(decodedEmail, email)
      if (email === decodedEmail) {
        const quantity = req.body;
        const query = { email: email };
        const cursor = data.find(query);
        const orders = await cursor.toArray();
        res.send(orders);
      }
      else{
          res.status(403).send({message: 'forbidden access'})
      }
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
    app.put(`/inventory/:id`, async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updatedProduct.quantity,
        },
      };
      const result = await data.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    app.put(`/editproduct/:id`, async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updatedProduct.quantity,
          description: updatedProduct.description,
          price: updatedProduct.price,
          email: updatedProduct.email,
          url: updatedProduct.url,
          supplier_name: updatedProduct.supplier_name,
          price: updatedProduct.price,
          name: updatedProduct.name,
        },
      };
      const result = await data.updateOne(filter, updatedDoc, options);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Paratronics Server is Running");
});

app.listen(port, () => {
  console.log(`Port is listening to ${port}`);
});
