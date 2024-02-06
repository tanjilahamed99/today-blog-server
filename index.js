const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config()



app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('welcome to my website')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8mn4lkn.mongodb.net/?retryWrites=true&w=majority`

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


        // jwt
        app.post('/jwt', (req, res) => {
            const info = req.body
            const token = jwt.sign(info, process.env.TOKEN_SECRET, { expiresIn: '1h' })
            res.send(token)

        })


        app.get('/blogs', async (req, res) => {
            const result = await blogCollections.find().toArray()
            res.send(result)
        })

        app.get('/blog/:id', async (req, res) => {

            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await blogCollections.findOne(query)
            return res.send(result)

        })

        app.get('/myBlogs', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const result = await blogCollections.find(query).toArray()
            res.send(result)
        })

        app.post('/blogs', async (req, res) => {
            const newBlog = req.body
            const result = await blogCollections.insertOne(newBlog)
            res.send(result)
        })

        app.delete('/myBlogs/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await blogCollections.deleteOne(query)
            res.send(result)
        })

        app.get('/updateBlog/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await blogCollections.findOne(query)
            res.send(result)
        })

        app.patch('/updateBlog/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const updateBlog = req.body

            const updateDoc = {
                $set: {
                    title: updateBlog.title,
                    image: updateBlog.image,
                    category: updateBlog.category,
                    content: updateBlog.content,
                    postedDate: updateBlog.postedDate
                }
            }
            const result = await blogCollections.updateOne(query, updateDoc)
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