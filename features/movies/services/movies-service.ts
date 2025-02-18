import { HttpClient } from "@/libraries/http";
import { token, movieDBBaseUrl, movieDBBaseImageUrl } from "../constants";
import { useUserStore } from "../store";
import type {
  MovieDetailsResponse,
  MovieListResponse,
  MovieDetails,
  MovieReview,
  PaginatedResultResponse,
  MovieReviewResponse,
  ImageResponse,
  MovieVideoResponse,
} from "../interfaces";

export class MoviesService {
  private headers = {
    Authorization: `Bearer ${token}`,
  };
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(movieDBBaseUrl);
  }

  get language() {
    return useUserStore.getState().language;
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    console.log('----->', id, this.language)
    const response = await this.httpClient.get<MovieDetailsResponse>(
      `movie/${id}?language=${this.language}`,
      {
        headers: this.headers,
      }
    );
    if (!response) return {} as MovieDetails;
    const video = await this.getVideoUrl(id);
    const result = this.mapMovieDetails(response);
    result.videoUrl = video.link;
    result.videoKey = video.videoId;
    return result;
  }

  async getNowPlayingMovies(): Promise<MovieDetails[]> {
    const response = await this.httpClient.get<MovieListResponse>(
      `movie/now_playing?language=${this.language}&page=1`,
      {
        headers: this.headers,
      }
    );
    const result = response.results.map(this.mapMovieDetails);
    return result;
  }

  async getPopularMovies(): Promise<MovieDetails[]> {
    const response = await this.httpClient.get<MovieListResponse>(
      `movie/popular?language=${this.language}&page=1`,
      {
        headers: this.headers,
      }
    );
    const result = response.results.map(this.mapMovieDetails);
    return result;
  }

  async getTopRatedMovies(): Promise<MovieDetails[]> {
    const response = await this.httpClient.get<MovieListResponse>(
      `movie/top_rated?language=${this.language}&page=1`,
      {
        headers: this.headers,
      }
    );
    const result = response.results.map(this.mapMovieDetails);
    return result;
  }

  async getUpcomingMovies(): Promise<MovieDetails[]> {
    const response = await this.httpClient.get<MovieListResponse>(
      `movie/upcoming?language=${this.language}&page=1`,
      {
        headers: this.headers,
      }
    );
    const result = response.results.map(this.mapMovieDetails);
    return result;
  }

  async getMovieReviews(id: number): Promise<MovieReview[]> {
    const { results = [] } = await this.httpClient.get<
      PaginatedResultResponse<MovieReviewResponse>
    >(`movie/${id}/reviews?language=${this.language}&page=1`, {
      headers: this.headers,
    });

    return results.map(this.mapMovieReview).reverse();
  }

  async getRecommendations(id: number): Promise<MovieDetails[]> {
    const response = await this.httpClient.get<MovieListResponse>(
      `movie/${id}/recommendations?language=${this.language}&page=1`,
      {
        headers: this.headers,
      }
    );
    const result = response.results.map(this.mapMovieDetails);
    return result;
  }

  async findMovies(query: string): Promise<MovieDetails[]> {
    const response = await this.httpClient.get<MovieListResponse>(
      `search/movie?query=${query}&include_adult=false&language=${this.language}&page=1`,
      {
        headers: this.headers,
      }
    );
    const result = response.results.map(this.mapMovieDetails);
    return result;
  }

  async getImages(id: number): Promise<string[]> {
    const response = await this.httpClient.get<ImageResponse>(
      `movie/${id}/images`,
      {
        headers: this.headers,
      }
    );
    return response.backdrops
      .slice(0, 7)
      .map((item) => `${movieDBBaseImageUrl}${item.file_path}`);
  }

  async getVideoUrl(id: number): Promise<{ videoId: string; link: string }> {
    const { results } = await this.httpClient.get<
      PaginatedResultResponse<MovieVideoResponse>
    >(`movie/${id}/videos?language=${this.language}`, {
      headers: this.headers,
    });
    let data: MovieVideoResponse | undefined = undefined;
    const firstOption = results
      .filter((item) => item.official && item.type === "Trailer")
      .at(0);

    if (firstOption) {
      data = firstOption;
    } else {
      const fallbackOption = results
        .filter((item) => item.type === "Trailer")
        .at(0);
      data = fallbackOption;
    }

    let result = { videoId: "", link: "" };
    if (data && data.site === "YouTube") {
      result.link = `https://www.youtube.com/watch?v=${data.key}`;
      result.videoId = data.key;
    }

    return result;
  }

  private getYear(date: string): string {
    const result = new Date(date);
    return result.getFullYear().toString();
  }

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const formattedDate = new Intl.DateTimeFormat("pt-BR").format(date);
    return formattedDate;
  }

  private formatRuntime(runtime: number = 0): string {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  }

  private formatVoteCount(voteCount: number): string {
    return voteCount > 1000 ? `${voteCount / 1000}k` : `${voteCount}`;
  }

  private formatVoteAverage(voteAverage: number): string {
    return voteAverage.toFixed(1);
  }

  private getRestCompanies(companies: any[] = []): string {
    return companies.length > 4 ? `+${companies.length - 4}` : "";
  }

  mapMovieDetails = (response: MovieDetailsResponse): MovieDetails => {
    return {
      id: response.id,
      title: response.title,
      overview: response.overview,
      backdropPath: `${movieDBBaseImageUrl}${response.backdrop_path}`,
      posterPath: `${movieDBBaseImageUrl}${response.poster_path}`,
      genre: response.genres?.at(0)?.name || "",
      releaseDate: this.getYear(response.release_date),
      runtime: this.formatRuntime(response.runtime),
      voteCount: this.formatVoteCount(response.vote_count),
      voteAverageStr: this.formatVoteAverage(response.vote_average),
      voteAverage: response.vote_average,
      companies: response.production_companies
        ?.slice(0, 4)
        ?.map((company) => `${movieDBBaseImageUrl}${company.logo_path}`),
      restCompanies: this.getRestCompanies(response.production_companies),
    };
  };

  mapMovieReview = (response: MovieReviewResponse): MovieReview => {
    return {
      userName: response.author,
      avatar: response.author_details.avatar_path
        ? `${movieDBBaseImageUrl}${response.author_details.avatar_path}`
        : undefined,
      content: response.content,
      rating: response.author_details.rating,
      createdAt: this.formatDate(response.created_at),
    };
  };
}
