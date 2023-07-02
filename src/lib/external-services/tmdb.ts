import axios, { AxiosResponse } from "axios";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";
import { IRefTag } from "~/interfaces/IRefTag";

interface TMDBMoviesSearchResponse {
  results: {
    poster_path: string;
    title: string;
    original_title: string;
    release_date: string;
    id: number;
  }[];
}

interface TMBDMovieFetchResponse {
  title: string;
  poster_path: string;
}

const searchMovies = async (query: string): Promise<IRefTag[]> => {
  const queryParams = query.split(" ").reduce((acc, s) => `${acc}+${s}`);

  const resp: AxiosResponse<TMDBMoviesSearchResponse> = await axios({
    method: "GET",
    url: `https://api.themoviedb.org/3/search/movie?query=${queryParams}`,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  return resp.data.results.map((result) => {
    return {
      url: `https://www.themoviedb.org/movie/${result.id}`,
      title: result.title,
      preview: result.poster_path ? `https://image.tmdb.org/t/p/w200${result.poster_path}` : "",
      additionalInfoOne: result.release_date,
      additionalInfoTwo: "",
      category: "movie"
    };
  });
};

const fetchMovie = async (id: string, url: string): Promise<IFeedRefTag> => {
  const resp: AxiosResponse<TMBDMovieFetchResponse> = await axios({
    method: "GET",
    url: `https://api.themoviedb.org/3/movie/${id}`,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  return {
    primaryInfo: resp.data.title,
    secondaryInfo: "",
    preview: resp.data.poster_path ? `https://image.tmdb.org/t/p/w200${resp.data.poster_path}` : "",
    url: url,
    category: "movie"
  };
};

export { searchMovies, fetchMovie };
