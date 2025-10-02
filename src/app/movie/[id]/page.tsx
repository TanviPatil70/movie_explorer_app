"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface MovieDetail {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  genres: { id: number; name: string }[];
  vote_average: number;
}

export default function MovieDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [updatingFav, setUpdatingFav] = useState(false);

  const isFavorite = movie ? favorites.includes(movie.id) : false;

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${params.id}?api_key=${apiKey}`
        );
        if (!res.ok) {
          setError("Failed to fetch movie details.");
          setMovie(null);
        } else {
          const data = await res.json();
          setMovie(data);
        }
      } catch {
        setError("An error occurred while fetching data.");
        setMovie(null);
      }
      setLoading(false);
    };

    const fetchFavorites = async () => {
      if (!session) return;
      try {
        const res = await fetch("/api/user/favorites");
        if (res.ok) {
          const data = await res.json();
          setFavorites(data.favorites || []);
        }
      } catch {
        // silently handle errors
      }
    };

    fetchMovie();
    fetchFavorites();
  }, [params.id, session]);

  const toggleFavorite = async () => {
    if (!session || !movie) {
      alert("Please sign in to manage favorites.");
      return;
    }

    setUpdatingFav(true);
    try {
      const method = isFavorite ? "DELETE" : "POST";
      await fetch("/api/user/favorites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id }),
      });

      setFavorites((prev) =>
        isFavorite ? prev.filter((id) => id !== movie.id) : [...prev, movie.id]
      );
    } catch {
      alert("Failed to update favorites.");
    }
    setUpdatingFav(false);
  };

  if (loading)
    return (
      <p className="p-12 text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
        Loading movie details...
      </p>
    );
  if (error)
    return (
      <p className="p-12 text-lg font-semibold text-red-600 dark:text-red-400 text-center">
        {error}
      </p>
    );
  if (!movie)
    return (
      <p className="p-12 text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
        Movie not found.
      </p>
    );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex justify-center items-center py-12">
      <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl">
        {/* Poster */}
        <div className="flex-shrink-0 flex items-center justify-center bg-gradient-to-b from-gray-100 via-gray-200 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-xl shadow-md w-56 h-80 object-cover"
            />
          ) : (
            <div className="w-56 h-80 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900">
              <span className="text-gray-500 dark:text-gray-300">No Image</span>
            </div>
          )}
        </div>
        {/* Details */}
        <div className="flex-1 p-8 flex flex-col">
          <h1 className="text-3xl font-extrabold mb-4 text-indigo-900 dark:text-indigo-200">{movie.title}</h1>
          <div className="mb-4 space-y-1 text-base">
            <div><span className="font-semibold">Release Date:</span> {movie.release_date}</div>
            <div><span className="font-semibold">Rating:</span> {movie.vote_average}</div>
            <div>
              <span className="font-semibold">Genres:</span> {Array.isArray(movie.genres) ? movie.genres.map(g => g.name).join(", ") : "N/A"}
            </div>
          </div>
          <p className="mb-8 text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{movie.overview}</p>
          <div className="flex flex-col gap-4 w-full mt-auto">
            <button
              onClick={toggleFavorite}
              disabled={updatingFav}
              className={`w-full py-3 rounded-lg transition font-bold shadow-sm ${
                isFavorite
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white`}
            >
              {updatingFav
                ? "Updating..."
                : isFavorite
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 font-bold transition"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
