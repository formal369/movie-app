import React, { useEffect, useState } from 'react';
import { Tooltip } from "antd";
import {LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import Axios from 'axios';

const LikeDislikes = (props) => {

    const [Likes, setLikes] = useState(0);
    const [Dislikes, setDislikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);
    const [DislikeAction, setDislikeAction] = useState(null);

    let variable = { }

    if(props.movie) {
        variable = { movieId: props.movieId , userId: props.userId }
    } else {
        variable = { commentId: props.commentId, userId: props.userId }
    }
    
    
    
    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
            .then(response => {
                if(response.data.success) {

                    // 얼마나 많은 좋아요를 받았는가
                    setLikes(response.data.likes.length)

                    // 내가 이미 좋아요를 눌렀는가

                    response.data.likes.map(like => {
                        if(like.userId === props.userId) {
                            setLikeAction("liked")
                        }
                    })

                } else {
                    alert('Like 정보를 가져오지 못했습니다.')
                }
            })

        Axios.post('/api/like/getDislikes', variable)
            .then(response => {
                if(response.data.success) {

                    // 얼마나 많은 싫어요를 받았는가
                    setDislikes(response.data.dislikes.length)

                    // 내가 이미 싫어요를 눌렀는가

                    response.data.dislikes.map(dislike => {
                        if(dislike.userId === props.userId) {
                            setDislikeAction("disliked")
                        }
                    })

                } else {
                    alert('Dislike 정보를 가져오지 못했습니다.')
                }
            })
    }, [])
    

    const onLike = () => {
        if(LikeAction === null) {   // Like가 클릭이 되어있지 않을 경우
            Axios.post('/api/like/upLike', variable)
                .then(response => {
                    if(response.data.success) {    
                        
                        setLikes(Likes + 1)
                        setLikeAction("liked")

                        if(DislikeAction !== null) {    // Dislike가 클릭이 되어있는 경우
                            setDislikeAction(null)
                            setDislikes(Dislikes - 1)
                        }

                    } else {
                        alert('Like를 올리지 못했습니다.')
                    }
                })
        } else {                    // Like가 클릭이 되어있을 경우
            
            Axios.post('/api/like/unLike', variable)
                .then(response => {
                    if(response.data.success) {
                        setLikes(Likes - 1)
                        setLikeAction(null)
                    } else {
                        alert('Like를 내리지 못했습니다.')
                    }
                })

        }
    }

    const onDislike = () => {
        if(DislikeAction !== null) { // Dislike가 클릭이 되어있는 경우
            Axios.post('/api/like/unDislike', variable)
                .then(response => {
                    if(response.data.success) {
                        setDislikes(Dislikes - 1)
                        setDislikeAction(null)
                    } else {
                        alert('Dislike를 내리지 못했습니다.')
                    }
                })
        } else {                    // Dislike가 클릭이 되어있지 않은 경우
            Axios.post('/api/like/upDislike', variable)
            .then(response => {
                if(response.data.success) {
                    setDislikes(Dislikes + 1)
                    setDislikeAction("disliked")

                    if(LikeAction !== null) {   // Like가 클릭이 되어있는 경우
                        setLikeAction(null)
                        setLikes(Likes -1)
                    }

                } else {
                    alert('Dislike를 내리지 못했습니다.')
                }
            })
        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <LikeOutlined 
                        type="like" 
                        theme={LikeAction === 'liked'? 'filled' : 'outlined'} 
                        onClick={onLike} 
                        />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <DislikeOutlined 
                        type="dislike" 
                        theme={DislikeAction === "disliked"? 'filled' : 'outlined'}
                        onClick={onDislike} 
                        />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
            </span>&nbsp;&nbsp;
        </div>
    );
};

export default LikeDislikes;