const express = require ('express');
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000'}))

app.post('/events', async(req, res)=>{
    const {type, data}= req.body
    
    if (type === 'CommentCreated') {
        
        let status = 'approved'
        if(data.content && data.content.includes('orange')){
            status = 'rejected'
        }
        
        await axios.post('http://event-bus:5005/events',{
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                content: data.content,
                status
            }
        })
    }

    res.send({ })
})

app.listen(5003, () => {
    console.log('moderation service')
    console.log('moderation service is running on http://localhost:5003')
})