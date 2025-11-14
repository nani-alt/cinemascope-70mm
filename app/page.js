"use client"; // ✅ Make this a client component

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch trending movies on first load
  useEffect(() => {
    async function loadTrending() {
      setLoading(true);
      try {
        const res = await fetch("/api/trending");
        const data = await res.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching trending:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTrending();
  }, []);

  // ✅ Handle search
  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* 🎞️ Hero Section */}
      <section
        className="relative h-[70vh] flex flex-col justify-center items-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <h1 className="text-5xl md:text-7xl font-extrabold z-10 text-white tracking-wide">
          Cinemascope 70mm
        </h1>
        <p className="text-gray-300 mt-4 text-lg z-10 max-w-xl">
          Discover your favorite films in stunning 70mm cinematic style 🎥
        </p>

        {/* 🔍 Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mt-6 z-10 flex w-full justify-center"
        >
          <input
            type="text"
            placeholder="🔍 Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-80 md:w-96 px-4 py-3 rounded-full text-black bg-white/90 border shadow-xl focus:ring-2 focus:ring-red-500 placeholder-gray-500"
          />
        </form>
      </section>
      <Link
        href="/favourites"
        className="absolute top-6 right-6 bg-white/10 border border-white/20 px-4 py-2 rounded-full hover:bg-white/20 transition"
      >
        ❤️ Favourites
      </Link>

      {/* 🎬 Movies Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-red-500">
          {query ? `🎥 Results for "${query}"` : "🔥 Trending This Week"}
        </h2>

        {loading ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : movies.length === 0 ? (
          <p className="text-gray-400 text-center">
            No movies found. Try another search.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <Link key={movie.imdbID} href={`/movie/${movie.imdbID}`}>
                <Card className="bg-zinc-900 border-zinc-800 hover:scale-105 hover:shadow-lg hover:shadow-red-600/20 transition-transform duration-300 overflow-hidden cursor-pointer">
                  <CardContent className="p-0">
                    <img
                      src={
                        movie.Poster && movie.Poster !== "N/A"
                          ? movie.Poster
                          : "https://via.placeholder.com/300x450?text=No+Image"
                      }
                      alt={movie.Title}
                      className="w-full h-72 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-white truncate">
                        {movie.Title}
                      </h3>
                      <p className="text-sm text-gray-400">🎬 {movie.Year}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
