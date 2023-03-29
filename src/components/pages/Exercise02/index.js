/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Exercise 02: Movie Library
 * We are trying to make a movie library for internal users. We are facing some issues by creating this, try to help us following the next steps:
 * !IMPORTANT: Make sure to run yarn movie-api for this exercise
 * 1. We have an issue fetching the list of movies, check why and fix it (handleMovieFetch)
 * 2. Create a filter by fetching the list of gender (http://localhost:3001/genres) and then loading
 * list of movies that belong to that gender (Filter all movies).
 * 3. Order the movies by year and implement a button that switch between ascending and descending order for the list
 * 4. Try to recreate the user interface that comes with the exercise (exercise02.png)
 * 
 * You can modify all the code, this component isn't well designed intentionally. You can redesign it as you need.
 */

import "./assets/styles.css";
import { useEffect, useState } from "react";

export default function Exercise02 () {
  const [movies, setMovies] = useState([])
  const [movieFilters, setMovieFilters] = useState([]);
  const [sortByText, setSortByText] = useState('Year Descending'); // Year Descending || Year Ascending
  const [fetchCount, setFetchCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleMovieFilter = () => {
    setLoading(true)
    fetch('http://localhost:3001/genres')
      .then(res => res.json())
      .then(json => {
        setMovieFilters(json)
        setLoading(false)
      })
      .catch(() => {
        setMovieFilters({})
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleMovieFilterSelect = (e) => {
    const value = e.target.value !== '' ? e.target.value : null
    handleMovieFetch(value);
  }

  const handleMovieFetch = (filter = null) => {
    setLoading(true)
    setFetchCount(fetchCount + 1)
    console.log('Getting movies')
    if (filter !== null){
      console.log('filter', filter)
    }
    fetch('http://localhost:3001/movies?_limit=50' + (filter !== null ? `&genres_like=${filter}` : '') )
      .then(res => res.json())
      .then(json => {
        setMovies(json)
        setLoading(false)
      })
      .catch(() => {
        setMovies([])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const sortMoviesByYear = () => {
    if (sortByText === 'Year Descending') {
      const sortedMovies = [...movies].sort((a, b) => a.year - b.year)
      setMovies(sortedMovies)
      setSortByText('Year Ascending')
    }else {
      const sortedMovies = [...movies].sort((a, b) => b.year - a.year)
      setMovies(sortedMovies)
      setSortByText('Year Descending')
    }
  }

  useEffect(() => {
    handleMovieFetch();
    handleMovieFilter();
  }, [])

  return (
    <section className="movie-library">
      <h1 className="movie-library__title">
        Movie Library
      </h1>
      <div className="movie-library__actions">
        <select name="genre" onChange={handleMovieFilterSelect} className="movie-library__actions__dropdown">
          <option value="">Select a genre</option>
          {movieFilters.length > 0 && movieFilters.map((genre, index) => (
            <option key={index} value={genre}>{genre}</option>
          ))}
        </select>
        <button onClick={() => sortMoviesByYear()} className="movie-library__actions__button">
          {sortByText}
        </button>
      </div>
      {loading ? (
        <div className="movie-library__loading">
          <p>Loading...</p>
          <p>Fetched {fetchCount} times</p>
        </div>
      ) : (
        <ul className="movie-library__list">
          {movies.length && movies.map(movie => (
            <li key={movie.id} className="movie-library__card">
              <img className="movie-library__card-image" src={movie.posterUrl} alt={movie.title} loading="lazy" />
              <div className="movie-library__card-copy-container">
                <ul className="movie-library__card-copy" >
                  <li className="movie-library-copy__title">{movie.title}</li>
                  <li className="movie-library-copy__genres">{movie.genres.join(', ')}</li>
                  <li className="movie-library-copy__year">{movie.year}</li>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}