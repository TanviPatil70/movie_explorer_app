"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchFavorites() {
      const res = await fetch("/api/user/favorites");
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
      }
      setLoading(false);
    }
    fetchFavorites();
  }, []);

  useEffect(() => {
    async function fetchMovieDetails() {
      if (favorites.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }
      try {
        const moviePromises = favorites.map((movieId) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
          ).then((res) => res.json())
        );
        const moviesData = await Promise.all(moviePromises);
        setMovies(moviesData);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovieDetails();
  }, [favorites]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg font-semibold text-indigo-900 dark:text-indigo-300">Loading favorites...</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors px-5 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold drop-shadow-lg text-gray-800 dark:text-white">
            My Favorites
          </h1>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg shadow transition"
            onClick={() => router.push("/")}
          >
            ← Back to Home
          </button>
        </div>
        {movies.length === 0 ? (
          <p className="text-xl text-gray-500 dark:text-gray-400 text-center py-20">No favorites yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {movies.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 cursor-pointer hover:shadow-indigo-500/60 hover:scale-[1.03] transition-transform flex flex-col items-center group">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="rounded-xl mb-4 shadow-md w-52 h-80 object-cover transition-all group-hover:brightness-110"
                    />
                  ) : (
                    <div className="w-52 h-80 bg-gray-200 dark:bg-gray-700 mb-4 flex items-center justify-center text-gray-500 dark:text-gray-400 rounded-xl">
                      No Image
                    </div>
                  )}
                  <h2 className="text-lg font-bold text-center mb-1 text-gray-800 dark:text-white">{movie.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-300">Rating: {movie.vote_average}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">Release: {movie.release_date}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
