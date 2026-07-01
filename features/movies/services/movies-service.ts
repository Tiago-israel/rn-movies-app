import { HttpClient } from "@/libraries/http";
import { token, movieDBBaseUrl, movieDBBaseImageUrl } from "../constants";
import { useUserStore } from "../store";
import type {
  MovieDetailsResponse,
  MovieDetails,
  MovieReview,
  PaginatedResultResponse,
  MovieReviewResponse,
  ImageResponse,
  MovieVideoResponse,
  GenresResponse,
  CreditResponse,
  Cast,
  GenericItem,
  PaginatedResult,
  ProviderResponse,
  ProviderWrapperResponse,
  ProviderItem,
  Provider,
  SearchMultiListResponse,
  SearchMultiResultResponse,
  SearchResultItem,
  SearchMultiPage,
  WatchProvidersListResponse,
  WatchProviderOption,
  Genre,
} from "../interfaces";
import { formatDate } from "../helpers";

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

  getNowPlayingMovies = async (
    page = 1,
    opts?: { signal?: AbortSignal }
  ): Promise<PaginatedResult<GenericItem>> => {
    const response = await this.httpClient.get<
      PaginatedResultResponse<MovieDetailsResponse>
    >(`movie/now_playing?language=${this.language}&page=${page}`, {
      headers: this.headers,
      signal: opts?.signal,
    });

    return {
      totalPages: response.total_pages,
      totalResults: response.total_results,
      results: response.results.map(this.mapGenericItem),
    };
  };

  getPopularMovies = async (
    page = 1,
    opts?: { signal?: AbortSignal }
  ): Promise<PaginatedResult<GenericItem>> => {
    const response = await this.httpClient.get<
      PaginatedResultResponse<MovieDetailsResponse>
    >(`movie/popular?language=${this.language}&page=${page}`, {
      headers: this.headers,
      signal: opts?.signal,
    });

    return {
      totalPages: response.total_pages,
      totalResults: response.total_results,
      results: response.results.map(this.mapGenericItem),
    };
  };

  getTopRatedMovies = async (
    page = 1,
    opts?: { signal?: AbortSignal }
  ): Promise<PaginatedResult<GenericItem>> => {
    const response = await this.httpClient.get<
      PaginatedResultResponse<MovieDetailsResponse>
    >(`movie/top_rated?language=${this.language}&page=${page}`, {
      headers: this.headers,
      signal: opts?.signal,
    });

    return {
      totalPages: response.total_pages,
      totalResults: response.total_results,
      results: response.results.map(this.mapGenericItem),
    };
  };

  getUpcomingMovies = async (
    page = 1,
    opts?: { signal?: AbortSignal }
  ): Promise<PaginatedResult<GenericItem>> => {
    const response = await this.httpClient.get<
      PaginatedResultResponse<MovieDetailsResponse>
    >(`movie/upcoming?language=${this.language}&page=${page}`, {
      headers: this.headers,
      signal: opts?.signal,
    });

    return {
      totalPages: response.total_pages,
      totalResults: response.total_results,
      results: response.results.map(this.mapGenericItem),
    };
  };

  /** Paginated discover — use with `withWatchProviders` instead of per-title /watch/providers for filters. */
  discoverMovies = async (
    page: number,
    options: {
      sortBy: string;
      withWatchProviders?: string;
      withGenres?: string;
    }
  ): Promise<PaginatedResult<GenericItem>> => {
    const region = this.watchRegion();
    const params = new URLSearchParams({
      language: this.language,
      page: String(page),
      sort_by: options.sortBy,
      watch_region: region,
      include_adult: "false",
    });
    if (options.withWatchProviders) {
      params.set("with_watch_providers", options.withWatchProviders);
    }
    if (options.withGenres) {
      params.set("with_genres", options.withGenres);
    }
    const response = await this.httpClient.get<
      PaginatedResultResponse<MovieDetailsResponse>
    >(`discover/movie?${params.toString()}`, { headers: this.headers });

    return {
      totalPages: response.total_pages,
      totalResults: response.total_results,
      results: response.results.map(this.mapGenericItem),
    };
  };

  async getMovieReviews(id: number): Promise<MovieReview[]> {
    const { results = [] } = await this.httpClient.get<
      PaginatedResultResponse<MovieReviewResponse>
    >(`movie/${id}/reviews?language=${this.language}&page=1`, {
      headers: this.headers,
    });

    return results.map(this.mapMovieReview).reverse();
  }

  async getRecommendations(id: number): Promise<MovieDetails[]> {
    const response = await this.httpClient.get<
      PaginatedResultResponse<MovieDetailsResponse>
    >(`movie/${id}/recommendations?language=${this.language}&page=1`, {
      headers: this.headers,
    });
    const result = response.results.map(this.mapMovieDetails);
    return result;
  }

  async searchMulti(
    query: string,
    page = 1,
    options?: { signal?: AbortSignal }
  ): Promise<SearchMultiPage> {
    const q = encodeURIComponent(query.trim());
    const response = await this.httpClient.get<SearchMultiListResponse>(
      `search/multi?query=${q}&include_adult=false&language=${this.language}&page=${page}`,
      {
        headers: this.headers,
        signal: options?.signal,
      }
    );
    return {
      results: response.results
        .map((item) => this.mapSearchMultiItem(item))
        .filter((item): item is SearchResultItem => item != null),
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  }

  /** Trending movies, TV, and people (TMDB combined daily list). */
  async getTrendingAllDay(
    page = 1,
    options?: { signal?: AbortSignal }
  ): Promise<Omit<SearchMultiPage, "totalResults">> {
    const response = await this.httpClient.get<SearchMultiListResponse>(
      `trending/all/day?language=${this.language}&page=${page}`,
      {
        headers: this.headers,
        signal: options?.signal,
      }
    );
    return {
      results: response.results
        .map((item) => this.mapSearchMultiItem(item))
        .filter((item): item is SearchResultItem => item != null),
      page: response.page,
      totalPages: response.total_pages,
    };
  }

  private mapSearchMultiItem(
    item: SearchMultiResultResponse
  ): SearchResultItem | null {
    if (item.media_type === "movie") {
      return {
        id: item.id,
        mediaType: "movie",
        title: item.title,
        genreIds: item.genre_ids,
        posterPath: item.poster_path
          ? `${movieDBBaseImageUrl}${item.poster_path}`
          : undefined,
      };
    }
    if (item.media_type === "tv") {
      return {
        id: item.id,
        mediaType: "tv",
        title: item.name,
        genreIds: item.genre_ids,
        posterPath: item.poster_path
          ? `${movieDBBaseImageUrl}${item.poster_path}`
          : undefined,
      };
    }
    if (item.media_type === "person") {
      return {
        id: item.id,
        mediaType: "person",
        title: item.name,
        posterPath: item.profile_path
          ? `${movieDBBaseImageUrl}${item.profile_path}`
          : undefined,
      };
    }
    return null;
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

  async getGenres(opts?: { signal?: AbortSignal }): Promise<Genre[]> {
    const { genres } = await this.httpClient.get<GenresResponse>(
      `genre/movie/list?language=${this.language}`,
      {
        headers: this.headers,
        signal: opts?.signal,
      }
    );

    return genres;
  }

  async getTvGenres(opts?: { signal?: AbortSignal }): Promise<Genre[]> {
    const { genres } = await this.httpClient.get<GenresResponse>(
      `genre/tv/list?language=${this.language}`,
      {
        headers: this.headers,
        signal: opts?.signal,
      }
    );

    return genres;
  }

  /** Regional streaming catalog (for filter chips). */
  async getWatchProvidersCatalog(
    media: "movie" | "tv" = "movie",
    opts?: { signal?: AbortSignal }
  ): Promise<WatchProviderOption[]> {
    const region = this.watchRegion();
    const response = await this.httpClient.get<WatchProvidersListResponse>(
      `watch/providers/${media}?watch_region=${region}`,
      { headers: this.headers, signal: opts?.signal }
    );
    const list = response?.results ?? [];
    return [...list]
      .sort(
        (a, b) => (a.display_priority ?? 0) - (b.display_priority ?? 0)
      )
      .map((p) => ({ id: p.provider_id, name: p.provider_name }));
  }

  private watchRegion(): string {
    const languageMap: Record<string, string> = {
      en: "US",
      "pt-BR": "BR",
    };
    return languageMap[this.language] || "US";
  }

  async getMovieCredits(id: number): Promise<Cast[]> {
    const result = await this.httpClient.get<CreditResponse>(
      `movie/${id}/credits?language=${this.language}`,
      {
        headers: this.headers,
      }
    );

    if (!result.cast) return new Promise(() => []);

    return result.cast.map((item) => ({
      id: item.id,
      character: item.character,
      name: item.name,
      originalName: item.original_name,
      popularity: item.popularity,
      profilePath: item.profile_path
        ? `${movieDBBaseImageUrl}${item.profile_path}`
        : "",
    }));
  }

  async getWatchProviders(movieId: number): Promise<Provider[]> {
    const region = this.watchRegion();
    const response = await this.httpClient.get<ProviderWrapperResponse>(
      `movie/${movieId}/watch/providers`,
      {
        headers: this.headers,
      }
    );
    const regionData = response?.results?.[region];
    if (regionData == null || typeof regionData !== "object") return [];
    return this.mapProvider(regionData);
  }

  private getYear(date: string): string {
    const result = new Date(date);
    return result.getFullYear().toString();
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
      createdAt: formatDate(response.created_at),
    };
  };

  mapGenericItem = (response: MovieDetailsResponse): GenericItem => {
    return {
      id: response.id,
      title: response.title,
      genreIds: response.genre_ids,
      posterPath: `${movieDBBaseImageUrl}${response.poster_path}`,
      backdropPath: response.backdrop_path
        ? `${movieDBBaseImageUrl}${response.backdrop_path}`
        : undefined,
    };
  };

  mapProvider = (response: ProviderResponse | undefined | null): Provider[] => {
    if (response == null || typeof response !== "object") return [];
    const flatrate = Array.isArray(response.flatrate) ? response.flatrate : [];
    const rent = Array.isArray(response.rent) ? response.rent : [];
    const buy = Array.isArray(response.buy) ? response.buy : [];
    const sortedProviders = flatrate.concat(rent).concat(buy);
    const link = typeof response.link === "string" ? response.link : "";

    const list: ProviderItem[] = [];
    for (const p of sortedProviders) {
      if (p == null || typeof p !== "object") continue;
      const existing = list.find((item) => {
        const [first] = item.provider_name.split(" ");
        return p.provider_name.startsWith(first);
      });

      if (!existing) {
        list.push(p);
      }
    }

    return list.map((item) => ({
      id: item.provider_id,
      link,
      image: `${movieDBBaseImageUrl}${item.logo_path}`,
    }));
  }
}
