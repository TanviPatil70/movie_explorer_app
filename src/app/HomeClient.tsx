"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaHeart } from "react-icons/fa";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Sci-Fi",
  "Thriller",
];

export default function HomeClient() {
  const { data: session } = useSession();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) throw new Error("TMDB API key not found");
        const searchEndpoint = query
          ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
              query
            )}&page=1`
          : `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=1`;

        const res = await fetch(searchEndpoint);
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();

        setMovies(data.results || []);
      } catch (error) {
        console.error(error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-10">
      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
          <h1 className="text-5xl font-extrabold tracking-tight text-indigo-900 dark:text-indigo-300 drop-shadow-lg leading-tight">
            CineFlix
          </h1>
          <nav>
            <ul className="flex flex-wrap gap-3">
              {genres.map((genre) => (
                <li key={genre}>
                  <Link href={`/genre/${genre.toLowerCase()}`}>
                    <span className="px-5 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-white font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-600 cursor-pointer text-sm shadow-sm transition">
                      {genre}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/favorites">
                  <span className="px-5 py-2 rounded-lg bg-pink-100 dark:bg-pink-800 text-pink-700 dark:text-pink-200 font-semibold hover:bg-pink-200 dark:hover:bg-pink-700 cursor-pointer text-sm shadow-sm transition flex items-center gap-2">
                    <FaHeart className="text-pink-500 dark:text-pink-300" />
                    Favorites
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-indigo-700 dark:text-indigo-300 text-base">
                {session.user?.email}
              </span>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Sign In
              </button>
              <Link href="/auth/signup">
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-800 text-indigo-300 rounded hover:bg-indigo-900 transition"
                >
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Search */}
      <form className="max-w-2xl mx-auto w-full mb-14">
        <input
          type="search"
          placeholder="Search movies, actors, or genres..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-indigo-400 dark:border-indigo-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-lg p-4 rounded-xl shadow-inner outline-none transition"
        />
      </form>

      {/* Main Content */}
      {loading ? (
        <p className="text-indigo-700 dark:text-indigo-200 text-center text-lg font-bold">
          Loading...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 auto-rows-[minmax(320px,auto)]">
          {movies.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`}>
              <div className="bg-gray-100 dark:bg-gray-900 border border-indigo-300 dark:border-indigo-700 rounded-2xl shadow-lg p-4 cursor-pointer hover:shadow-indigo-500 hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col items-center">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-72 object-cover rounded-xl shadow"
                  />
                ) : (
                  <div className="w-full h-72 bg-gradient-to-br from-indigo-200 to-gray-300 dark:from-indigo-900 dark:to-gray-800 rounded-xl flex items-center justify-center text-indigo-900 dark:text-indigo-200 font-bold">
                    No Image
                  </div>
                )}
                <h2 className="text-lg font-bold mt-4 text-indigo-900 dark:text-indigo-200 text-center break-words line-clamp-2 w-full">
                  {movie.title}
                </h2>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                  {movie.release_date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
