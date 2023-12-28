const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')



app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('welcome to my website')
})

// todayBlog
// 



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://todayBlog:P2P41Rexjb2vMDZY@cluster0.8mn4lkn.mongodb.net/?retryWrites=true&w=majority";

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
        // await client.connect();

        const blogCollections = client.db("todayBlog").collection("blogs");


        app.get('/blogs', async (req, res) => {
            const result = await blogCollections.find().toArray()
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.listen(port, () => {
    console.log(`app running on port ${port}`)
})