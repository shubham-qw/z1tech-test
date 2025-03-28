import React, { useState, useEffect } from "react";

const API_KEY = "d4fa9901";
const API_URL = "https://www.omdbapi.com/";

export default function MovieSearchApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDefaultMovies();
  }, []);

  const fetchMovies = async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?s=${searchTerm}&apikey=${API_KEY}`);
      const data = await response.json();
      if (data.Search) {
        setMovies(data.Search);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultMovies = async () => {
    try {
      const response = await fetch(`${API_URL}?s=batman&apikey=${API_KEY}`);
      const data = await response.json();
      if (data.Search) {
        setMovies(data.Search);
      }
    } catch (error) {
      console.error("Error fetching default movies:", error);
    }
  };

  const fetchMovieDetails = async (imdbID) => {
    try {
      const response = await fetch(`${API_URL}?i=${imdbID}&apikey=${API_KEY}`);
      const data = await response.json();
      setSelectedMovie(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchMovies();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Movie Search</h1>
      <p style={{ textAlign: "center", color: "#555", fontSize: "14px" }}>Search for movies, series, or episodes from the OMDb database.</p>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button onClick={fetchMovies} disabled={loading} style={{ padding: "10px", borderRadius: "5px", background: "#007BFF", color: "white", border: "none", cursor: "pointer" }}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {movies.map((movie) => (
          <div key={movie.imdbID} onClick={() => fetchMovieDetails(movie.imdbID)} style={{ cursor: "pointer", border: "1px solid #ddd", padding: "10px", textAlign: "center", borderRadius: "5px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
            <img src={movie.Poster} alt={movie.Title} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "5px" }} />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
          </div>
        ))}
      </div>
      {selectedMovie && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setSelectedMovie(null)}>
          <div style={{ background: "white", padding: "15px", maxWidth: "280px", textAlign: "center", borderRadius: "10px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}>
            <h2 style={{ fontSize: "16px", marginBottom: "8px" }}>{selectedMovie.Title}</h2>
            <img src={selectedMovie.Poster} alt={selectedMovie.Title} style={{ width: "100%", marginBottom: "8px", borderRadius: "5px" }} />
            <p style={{ fontSize: "12px" }}><strong>Year:</strong> {selectedMovie.Year}</p>
            <p style={{ fontSize: "12px" }}><strong>Genre:</strong> {selectedMovie.Genre}</p>
            <p style={{ fontSize: "12px" }}><strong>Actors:</strong> {selectedMovie.Actors}</p>
            <p style={{ fontSize: "12px", lineHeight: "1.4" }}><strong>Plot:</strong> {selectedMovie.Plot}</p>
            <button onClick={() => setSelectedMovie(null)} style={{ marginTop: "8px", padding: "8px", fontSize: "12px", borderRadius: "5px", background: "#007BFF", color: "white", border: "none", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}