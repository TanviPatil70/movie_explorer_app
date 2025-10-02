"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const genreMap: Record<string, number> = {
  action: 28,
  adventure: 12,
  comedy: 35,
  drama: 18,
  fantasy: 14,
  horror: 27,
  "sci-fi": 878,
  thriller: 53,
};

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

export default function GenreClient({ genreName }: { genreName: string }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchGenreMovies = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const genreId = genreMap[genreName.toLowerCase()] || 28;
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=1`;
        const res = await fetch(url);
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
    fetchGenreMovies();
  }, [genreName]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 text-gray-900 dark:text-white max-w-7xl mx-auto rounded-lg shadow-lg transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold capitalize">{genreName} Movies</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg shadow transition"
        >
          ← Back to Home
        </button>
      </div>

      {loading ? (
        <p className="text-center text-indigo-600 dark:text-indigo-400 font-bold">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {movies.map((movie) => (
            <a key={movie.id} href={`/movie/${movie.id}`}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:brightness-110 transition">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="w-full h-72 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{movie.title}</h2>
                  <p className="text-indigo-600 dark:text-indigo-400">{movie.release_date}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
