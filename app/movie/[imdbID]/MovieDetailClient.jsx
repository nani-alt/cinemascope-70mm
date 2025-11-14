"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";

export default function MovieDetailClient({ imdbID }) {
  const [movie, setMovie] = useState(null);
  const [isFav, setIsFav] = useState(false);

  // Fetch Movie Data
  useEffect(() => {
    async function loadMovie() {
      const res = await fetch(`/api/movie?id=${imdbID}`);
      const data = await res.json();
      setMovie(data);
    }
    loadMovie();
  }, [imdbID]);

  // Load favourite state
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
    setIsFav(favs.includes(imdbID));
  }, [imdbID]);

  // Toggle favourite
  function toggleFavourite() {
    let favs = JSON.parse(localStorage.getItem("favourites") || "[]");

    if (favs.includes(imdbID)) {
      favs = favs.filter(id => id !== imdbID);
      setIsFav(false);
    } else {
      favs.push(imdbID);
      setIsFav(true);
    }

    localStorage.setItem("favourites", JSON.stringify(favs));
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading movie...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white relative">

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-black/60 text-white rounded-full backdrop-blur-sm border border-white/20 hover:bg-black/80 transition"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
      </div>

      {/* Fav Button */}
      <button
        onClick={toggleFavourite}
        className="absolute top-6 right-6 z-50 px-4 py-2 bg-red-600 rounded-full flex items-center gap-2 hover:bg-red-700 transition"
      >
        <Heart size={20} fill={isFav ? "white" : "none"} />
        {isFav ? "Remove" : "Add"} Favourite
      </button>

      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">

        {/* Poster */}
        <div className="md:w-1/3">
          <img
            src={
              movie.Poster && movie.Poster !== "N/A"
                ? movie.Poster
                : "https://placehold.co/500x750?text=No+Poster"
            }
            alt={movie.Title}
            className="rounded-lg shadow-lg w-full"
          />
        </div>

        {/* Details */}
        <div className="md:w-2/3 space-y-4">
          <h1 className="text-4xl font-bold text-red-500">{movie.Title}</h1>
          <p className="text-gray-300 text-lg italic">{movie.Plot}</p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <p><strong>Genre:</strong> {movie.Genre}</p>
            <p><strong>Released:</strong> {movie.Released}</p>
            <p><strong>Runtime:</strong> {movie.Runtime}</p>
            <p><strong>IMDb Rating:</strong> {movie.imdbRating}</p>
            <p><strong>Director:</strong> {movie.Director}</p>
            <p><strong>Actors:</strong> {movie.Actors}</p>
          </div>

          <a
            href={`https://www.imdb.com/title/${movie.imdbID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            View on IMDb 🔗
          </a>
        </div>

      </div>
    </main>
  );
}
