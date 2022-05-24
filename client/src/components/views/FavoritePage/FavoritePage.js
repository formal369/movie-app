import React, { useEffect, useState } from 'react';
import './favorite.css';
import Axios from 'axios';
import { Popover } from 'antd'
import { IMAGE_BASE_URL } from '../../Config';

const FavoritePage = () => {

    const [Favorites, setFavorites] = useState([])


    useEffect(() => {

        fetchFavoritedMovies()

    }, [])
    

    const fetchFavoritedMovies = () => {
        Axios.post('/api/favorite/getFavoritedMovie', { userFrom: localStorage.getItem('userId') })
            .then(response => {
                if(response.data.success) {
                    setFavorites(response.data.favorites)
                } else {
                    alert('영화 정보를 가져오는데 실패했습니다.')
                }
            })
    }

    const onClickDelete = (movieId, userFrom) => {

        const variables = {
            movieId: movieId,
            userFrom: userFrom
        }

        Axios.post('/api/favorite/removeFromFavorite', variables)
            .then(response => {
                if(response.data.success) {
                    fetchFavoritedMovies()
                } else {
                    alert("리스트에서 지우는데 실패했습니다.")
                }
            })
    }

    const renderCards = Favorites.map((favorite, index) => {

        const content = (
            <div>
                {favorite.moviePost?
                    <img src={`${IMAGE_BASE_URL}w500${favorite.moviePost}`} /> : "no Image"
                }
            </div>
        )

        return <tr key={index}>
            <Popover content={content} title={`${favorite.movieTitle}`}>
                <td>{favorite.movieTitle}</td>
            </Popover>
            <td>{favorite.movieRunTime} mins</td>
            <td><button onClick={() => onClickDelete(favorite.movieId, favorite.userFrom)}>Remove</button></td>
        </tr>  
    })

    return (
        <div style={{ width: '85%', margin: '5rem auto'}}>
            <h2>Favorite Movies</h2>
            <hr />

            <table>
                <thead>
                    <tr>
                        <th>Movie Title</th>
                        <th>Movie Runtime</th>
                        <th>Remove from favorites</th>
                    </tr>
                </thead>
                <tbody>
                    {renderCards}
                </tbody>
            </table>
        </div>
    );
};

export default FavoritePage;