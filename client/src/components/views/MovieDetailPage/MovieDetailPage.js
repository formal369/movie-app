import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL, API_KEY, IMAGE_BASE_URL } from '../../Config';
import MainImage from '../LandingPage/Sections/MainImage';
import MovieInfo from './Sections/MovieInfo';
import GridCards from '../commons/GridCards';
import Favorite from './Sections/Favorite';
import Comment from './Sections/Comment';
import { Row } from 'antd';
import Axios from 'axios';

const MovieDetailPage = () => {
    
    const { movieId } = useParams();

    const [Movie, setMovie] = useState([]);
    const [Casts, setCasts] = useState([]);
    const [ActorToggle, setActorToggle] = useState(false);
    const [Comments, setComments] = useState([]);

    const movieVariable = {
        movieId: movieId
    }

    useEffect(() => {
        let endpointCrew = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
        let endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}`

        fetch(endpointInfo)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setMovie(response)
            })

        fetch(endpointCrew)
            .then(response => response.json())
            .then(response => {
                setCasts(response.cast)
            })

        Axios.post('/api/comment/getComments', movieVariable)
            .then(response => {
                console.log(response)
                if(response.data.success) {
                    setComments(response.data.comments)
                } else {
                    alert('코멘트 정보를 가져오지 못했습니다.')
                }
            })

    }, [])

    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }

    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }

    return (
        <div>
            {/* Header */}
            <MainImage 
                    image={`${IMAGE_BASE_URL}w1280${Movie.backdrop_path}`}
                    title={Movie.original_title}
                    text={Movie.overview}
                    />

            {/* Body */}
            <div style={{ width: '85%', margin: '1rem auto' }}>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Favorite movieInfo={Movie} movieId={movieId} userFrom={localStorage.getItem('userId')} />
                </div>

                {/* Movie Info */}
                <MovieInfo
                    movie={Movie }
                />
                <br />
                {/* Actors Grid */}

                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                    <button onClick={toggleActorView}> Toggle Actor View </button>
                </div>


                {ActorToggle && 
                    <Row gutter={[16, 16]}>
                    {Casts && Casts.map((cast, index) => (
                        <React.Fragment key={index}>
                            <GridCards
                                image={cast.profile_path ?
                                    `${IMAGE_BASE_URL}w500${cast.profile_path}` : null}
                                characterName={cast.name}
                            />

                        </React.Fragment>
                    ))}

                    </Row>
                }

                {/* Comments */}
                <Comment postId={movieId} commentLists={Comments} refreshFunction={refreshFunction} />

            </div>
        </div>
    );
};

export default MovieDetailPage;