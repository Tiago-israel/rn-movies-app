import { token, movieDBBaseUrl, movieDBBaseImageUrl } from "../constants";
import { HttpClient } from "@/libraries/http";
import { useUserStore } from "../store";
import type {
  GenericItem,
  PaginatedResult,
  PaginatedResultResponse,
  TVSeriesListItem,
  TVSeriesListItemResponse,
} from "../interfaces";

export class TVSeriesService {
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

  getAiringToday = async (page = 1): Promise<PaginatedResult<GenericItem>> => {
    const response = await this.httpClient.get<
      PaginatedResultResponse<TVSeriesListItemResponse>
    >(`tv/airing_today?language=${this.language}&page=${page}`, {
      headers: this.headers,
    });
    
    return {
      totalPages: response.total_results,
      results: response.results.map(this.mapGenericItem),
    };
  };

  getOnTheAir = async (page = 1): Promise<PaginatedResult<GenericItem>> => {
    const response = await this.httpClient.get<
      PaginatedResultResponse<TVSeriesListItemResponse>
    >(`tv/on_the_air?language=${this.language}&page=${page}`, {
      headers: this.headers,
    });

    return {
      totalPages: response.total_results,
      results: response.results.map(this.mapGenericItem),
    };
  };

  getPopular = async (page = 1): Promise<PaginatedResult<GenericItem>> => {
    const response = await this.httpClient.get<
      PaginatedResultResponse<TVSeriesListItemResponse>
    >(`tv/popular?language=${this.language}&page=${page}`, {
      headers: this.headers,
    });

    return {
      totalPages: response.total_results,
      results: response.results.map(this.mapGenericItem),
    };
  };

  getTopRated = async (page = 1): Promise<PaginatedResult<GenericItem>> => {
    const response = await this.httpClient.get<
      PaginatedResultResponse<TVSeriesListItemResponse>
    >(`tv/top_rated?language=${this.language}&page=${page}`, {
      headers: this.headers,
    });

    return {
      totalPages: response.total_results,
      results: response.results.map(this.mapGenericItem),
    };
  };

  mapTVSeriesListItem = (
    response: TVSeriesListItemResponse
  ): TVSeriesListItem => {
    return {
      id: response.id,
      overview: response.overview,
      posterPath: `${movieDBBaseImageUrl}${response.poster_path}`,
      backdropPath: `${movieDBBaseImageUrl}${response.backdrop_path}`,
      firstAirDate: response.first_air_date,
      voteAverage: response.vote_average,
      name: response.name,
      adult: response.adult,
      originCountry: response.origin_country,
      originalLanguage: response.original_language,
      originalName: response.original_name,
      genreIds: response.genre_ids,
      popularity: response.popularity,
      voteCount: response.vote_count,
      releaseDate: response.first_air_date,
    };
  };

  mapGenericItem = (response: TVSeriesListItemResponse): GenericItem => {
    return {
      id: response.id,
      posterPath: `${movieDBBaseImageUrl}${response.poster_path}`,
    };
  };
}
