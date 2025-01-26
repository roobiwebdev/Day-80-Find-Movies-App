import { useEffect, useState } from "react";
import Search from "./components/Search.tsx";
import FullPageSpinner from "./components/FullPageSpinner.tsx";
import Spinner from "./components/Spinner.tsx";
import MovieCard from "./components/MovieCard.tsx";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.ts";
import Pagination from "./components/Pagination.tsx";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  original_language: string;
  vote_average: number;
};

type TrendingMovie = {
  $id: string;
  poster_url: string;
  title: string;
};

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFullPageLoading, setIsFullPageLoading] = useState<boolean>(true);
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchMovies(searchTerm, newPage);
  };

  const fetchMovies = async (query = "", page = 1): Promise<void> => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}&page=${page}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      setTotalPages(Math.min(data.total_pages, 50)); // Cap total pages to 50

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    } finally {
      setIsFullPageLoading(false);
    }
  };

  useEffect(() => {
    setIsFullPageLoading(true);
    loadTrendingMovies();
    fetchMovies();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchMovies(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  if (isFullPageLoading) {
    return <FullPageSpinner />;
  }

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>

        <footer>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </footer>
      </div>
    </main>
  );
};

export default App;
