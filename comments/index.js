const express = require ('express');
const { randomBytes } = require('node:crypto');
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000'}))

const posts = [];

const postComments = []

app.get('/posts/:id/comments', (req, res)=>{
    res.json(postComments.filter(comment => comment.postId === req.params.id))
})

app.post('/posts/:id/comments', (req, res)=>{
    const postId = req.params.id;
    const content = req.body.content;
    const comment = {
        id: randomBytes(4).toString('hex'),
        postId,
        content,
        status: 'pending'
    };
    postComments.push(comment)

    axios.post('http://localhost:5005/events',{
        type:'CommentCreated',
        data: comment
    }).catch((err) =>{
        console.log('error sending event to event/bus:', err.message)
    })

    res.status(201).json(comment)
})

app.post('/events', (req, res) => {
    const { type,data }= req.body

    if(type === 'CommentModerated') {
        const comment = postComments.find(c => c.id === data.id)

        if(comment){
            comment.status = data.status

            axios.post('http://localhost:5005/events',{
                type: 'CommentUpdated',
                data: comment
            }).catch((err)=>{
                console.log('error sending update event:', err.message)
            })
        }
    }

    console.log('Received event:', req.body)
    res.json({ })
})

app.listen(5001, ()=>{
    console.log('comments service')
    console.log('Server is running on http://localhost:5001')
})