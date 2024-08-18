const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const {MongoClient, ServerApiVersion} = require("mongodb");
const port = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aeb0oh8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const productCollection = client
      .db("KhanGadgets")
      .collection("all-products");

    app.get("/allProducts", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log("pagination query", page, size);
      const result = await productCollection
        .find()
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });

    app.get("/totalProducts", async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      res.send({count});
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ping: 1});
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// --------------------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Welcome to khan gadgets");
});

app.listen(port, () => {
  console.log(`gadgets running on port ${port}`);
});
