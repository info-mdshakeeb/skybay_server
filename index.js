const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT
const app = express();

//muddile ware :

app.use(cors())
app.use(express.json())

//basic setup :
app.get('/', (req, res) => {
    res.send('node is open')
})
const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@skybay.j149nmh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const mongodb = () => {
    try {
        client.connect()
        console.log('database connected');
    } catch (error) {
        console.log(error);
    }
}
mongodb()
const Users = client.db('skybay').collection('users')
const Posts = client.db('skybay').collection('posts')
const Comments = client.db('skybay').collection('comments')

app.post('/user', async (req, res) => {
    const userdata = req.body;
    // console.log(userdata);
    try {
        const result = await Users.insertOne(userdata)
        res.send({ success: true, data: result })
    } catch (error) {
        console.log(error.name, error.message)
        res.send({ success: false, message: error.message })
    }
})
app.get('/user', async (req, res) => {
    const { email } = req.query
    // console.log(email);
    const query = { Email: email }
    try {
        const result = await Users.find(query).toArray()
        // console.log(result);
        res.send({ success: true, data: result })
    } catch (error) {
        console.log(error.name, error.message)
        res.send({ success: false, message: error.message })
    }
})
app.put('/user/:id', async (req, res) => {
    const { id } = req.params
    // console.log(id);
    const filter = { _id: ObjectId(id) }
    const { displayName, Email, Address, University } = req.body.dataBaseUserUpdate;
    const updateDoc = {
        $set: {
            displayName,
            Email,
            Address,
            University
        }
    }
    try {
        const result = await Users.updateMany(filter, updateDoc)
        res.send({
            success: true,
            data: result
        })
        // console.log(filter, updateDoc);
    } catch (error) {
        console.log(error.name, error.message)
        res.send({ success: false, message: error.message })
    }

})
app.post('/posts', async (req, res) => {
    const postdata = req.body;
    console.log(postdata);
    try {
        const result = await Posts.insertOne(postdata)
        res.send({ success: true, data: result })
    } catch (error) {
        console.log(error.name, error.message)
        res.send({ success: false, message: error.message })
    }
})
app.put('/posts/:id', async (req, res) => {
    const { id } = req.params
    const { postid } = req.body
    const filter = { _id: ObjectId(id) }
    const updateDoc = {
        $push: {
            likesPerson: postid
        },
        $inc: {
            likes: 1
        }
    }
    try {
        const result = await Posts.updateMany(filter, updateDoc)
        res.send({
            success: true,
            data: result
        })
        // console.log(filter, updateDoc);
    } catch (error) {
        console.log(error.name, error.message)
        res.send({ success: false, message: error.message })
    }
})
app.get('/posts', async (req, res) => {
    const query = {}
    try {
        const result = await Posts.find(query).sort({ dataAdded: -1 }).toArray();
        res.send({ success: true, data: result })
    } catch (error) {
        console.log(error.name, error.message)
        res.send({ success: false, message: error.message })
    }
})

app.get('/likeposts', async (req, res) => {
    const query = {}
    try {
        const result = await Posts.find(query).sort({ likes: -1 }).toArray();
        console.log(result.length);
        res.send({ success: true, data: result })
    } catch (error) {
        console.log(error.name, error.message)
        res.send({ success: false, message: error.message })
    }
})



app.get('/post/:id', async (req, res) => {
    const { id } = req.params
    const query = { _id: ObjectId(id) }
    try {
        const result = await Posts.find(query).toArray();
        res.send({ success: true, data: result })
    } catch (error) {
        console.log(error.name, error.message)
        res.send({ success: false, message: error.message })
    }
})
app.post('/comments', async (req, res) => {
    const commentData = req.body;
    // console.log(commentData);
    try {
        const result = await Comments.insertOne(commentData)
        res.send({ success: true, data: result })
    } catch (error) {
        console.log(error.name, error.message)
        res.send({ success: false, message: error.message })
    }
})
app.get('/comments', async (req, res) => {
    const { postId } = req.query
    const query = { postID: postId }
    // console.log(postId);
    try {
        const result = await Comments.find(query).toArray();
        res.send({ success: true, data: result })
    } catch (error) {
        console.log(error.name, error.message)
        res.send({ success: false, message: error.message })
    }
})


app.listen(port, () => console.log(process.env.PORT, "is open"))