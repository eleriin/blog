import React, {useEffect, useState} from 'react'
import axios from 'axios'

const CommentsList = ({ comments }) =>{
      
    const renderedComments = comments.map((comment) =>{
        let content
        if(comment.status === 'approved'){
            content = comment.content
        } else if(comment.status === 'pending'){
            content= 'this comment is awaiting moderation'
        }else{
            content= 'this comment has been rejected'
        }

        return <li key={comment.id}>{content}</li>
    })

    return (
        <ul>
            {renderedComments}
        </ul>
    )
}

export default CommentsList