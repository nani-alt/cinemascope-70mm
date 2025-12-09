"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function FavouritesPage() {
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favourites") || "[]");

    async function loadMovies() {
      const movies = [];

      for (const id of stored) {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&i=${id}`
        );
        const data = await res.json();
        if (data.Response !== "False") movies.push(data);
      }

      setFavs(movies);
    }

    loadMovies();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 text-white rounded-full border border-white/20 hover:bg-black/80 transition mb-6"
      >
        <ArrowLeft size={20} />
        Back to Home
      </Link>

      <h1 className="text-4xl font-bold text-red-500 mb-10">
        ❤️ Your Favourite Movies
      </h1>

      {favs.length === 0 ? (
        <p className="text-gray-400 text-lg">No favourites yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {favs.map((movie) => (
            <Link key={movie.imdbID} href={`/movie/${movie.imdbID}`}>
              <Card className="bg-zinc-900 border-zinc-800 hover:scale-105 transition cursor-pointer overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={
                      movie.Poster && movie.Poster !== "N/A"
                        ? movie.Poster
                        : "https://placehold.co/400x600?text=No+Image"
                    }
                    alt={movie.Title}
                    className="w-full h-72 object-cover"
                  />

                  <div className="p-3">
                    <h3 className="font-semibold truncate">{movie.Title}</h3>
                    <p className="text-sm text-gray-400">🎬 {movie.Year}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
