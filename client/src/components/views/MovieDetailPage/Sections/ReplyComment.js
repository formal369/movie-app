import React, { useEffect, useState } from 'react';
import SingleComment from './SingleComment';

const ReplyComment = (props) => {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)

    // 대댓글수를 구하는 함수
    useEffect(() => {
      let commentNumber = 0;

      props.commentLists.map((comment) => {
          if(comment.responseTo === props.parentCommentId) {
              commentNumber++
          }
      })
    
      setChildCommentNumber(commentNumber)
     
    }, [props.commentLists, props.parentCommentId])
    

    const renderReplyComment = (parentCommentId) => (

        props.commentLists.map((comment, index) => (
            <React.Fragment>
                {
                    comment.responseTo === parentCommentId &&
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment postId={props.postId} comment={comment} refreshFunction={props.refreshFunction} />
                        <ReplyComment postId={props.postId} commentLists={props.commentLists} parentCommentId={comment._id} refreshFunction={props.refreshFunction} />
                    </div>
                }
            </React.Fragment>
        ))
    )

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }

    return (
        <div>

            {ChildCommentNumber > 0 && 
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick={onHandleChange} >
                    View {ChildCommentNumber} more comment(s)
                </p>
            }

            {OpenReplyComments && 
                renderReplyComment(props.parentCommentId)
            }
        </div>
    );
};

export default ReplyComment;


