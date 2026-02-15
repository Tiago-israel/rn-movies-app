import { token, movieDBBaseUrl, movieDBBaseImageUrl } from "../constants";
import { HttpClient } from "@/libraries/http";
import { useUserStore } from "../store";
import type {
  Cast,
  CreditResponse,
  Episode,
  GenericItem,
  ImageResponse,
  MovieVideoResponse,
  PaginatedResult,
  PaginatedResultResponse,
  Provider,
  ProviderItem,
  ProviderResponse,
  ProviderWrapperResponse,
  SeriesDetails,
  TVSeriesDetailsResponse,
  TVSeriesListItem,
  TVSeriesListItemResponse,
} from "../interfaces";
import type { TVSeasonDetailsResponse, TVSeasonEpisodeResponse } from "../interfaces/response/tv-season-details.response";

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
      backdropPath: response.backdrop_path
        ? `${movieDBBaseImageUrl}${response.backdrop_path}`
        : undefined,
    };
  };

  private getYear(date: string): string {
    const result = new Date(date);
    return result.getFullYear().toString();
  }

  private formatVoteCount(voteCount: number): string {
    return voteCount > 1000 ? `${voteCount / 1000}k` : `${voteCount}`;
  }

  private formatVoteAverage(voteAverage: number): string {
    return voteAverage.toFixed(1);
  }

  private getRestCompanies(companies: { logo_path: string }[] = []): string {
    return companies.length > 4 ? `+${companies.length - 4}` : "";
  }

  async getSeriesDetails(id: number): Promise<SeriesDetails> {
    const response = await this.httpClient.get<TVSeriesDetailsResponse>(
      `tv/${id}?language=${this.language}`,
      { headers: this.headers }
    );
    if (!response) return {} as SeriesDetails;
    const video = await this.getSeriesVideoUrl(id);
    const result = this.mapSeriesDetails(response);
    result.videoUrl = video.link;
    result.videoKey = video.videoId;
    return result;
  }

  mapSeriesDetails = (response: TVSeriesDetailsResponse): SeriesDetails => {
    return {
      id: response.id,
      name: response.name,
      overview: response.overview,
      backdropPath: `${movieDBBaseImageUrl}${response.backdrop_path}`,
      posterPath: `${movieDBBaseImageUrl}${response.poster_path}`,
      genre: response.genres?.at(0)?.name || "",
      firstAirDate: response.first_air_date ? this.getYear(response.first_air_date) : "",
      lastAirDate: response.last_air_date ? this.getYear(response.last_air_date) : "",
      numberOfSeasons: response.number_of_seasons,
      numberOfEpisodes: response.number_of_episodes,
      voteCount: this.formatVoteCount(response.vote_count),
      voteAverageStr: this.formatVoteAverage(response.vote_average),
      voteAverage: response.vote_average,
      companies: response.production_companies
        ?.slice(0, 4)
        ?.map((c) => (c.logo_path ? `${movieDBBaseImageUrl}${c.logo_path}` : ""))
        .filter(Boolean),
      restCompanies: this.getRestCompanies(response.production_companies),
    };
  };

  async getSeriesImages(id: number): Promise<string[]> {
    const response = await this.httpClient.get<ImageResponse>(
      `tv/${id}/images`,
      { headers: this.headers }
    );
    return (response?.backdrops || [])
      .slice(0, 7)
      .map((item) => `${movieDBBaseImageUrl}${item.file_path}`);
  }

  async getSeriesVideoUrl(id: number): Promise<{ videoId: string; link: string }> {
    const { results } = await this.httpClient.get<
      PaginatedResultResponse<MovieVideoResponse>
    >(`tv/${id}/videos?language=${this.language}`, {
      headers: this.headers,
    });
    const firstOption = (results || [])
      .filter((item) => item.official && item.type === "Trailer")
      .at(0);
    const data = firstOption ?? (results || []).filter((item) => item.type === "Trailer").at(0);
    const result = { videoId: "", link: "" };
    if (data && data.site === "YouTube") {
      result.link = `https://www.youtube.com/watch?v=${data.key}`;
      result.videoId = data.key;
    }
    return result;
  }

  async getSeriesCredits(id: number): Promise<Cast[]> {
    const result = await this.httpClient.get<CreditResponse>(
      `tv/${id}/credits?language=${this.language}`,
      { headers: this.headers }
    );
    if (!result?.cast) return [];
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

  async getSeriesRecommendations(id: number): Promise<GenericItem[]> {
    const response = await this.httpClient.get<
      PaginatedResultResponse<TVSeriesListItemResponse>
    >(`tv/${id}/recommendations?language=${this.language}&page=1`, {
      headers: this.headers,
    });
    return (response?.results || []).map(this.mapGenericItem);
  }

  async getSeasonDetails(seriesId: number, seasonNumber: number): Promise<Episode[]> {
    const response = await this.httpClient.get<TVSeasonDetailsResponse>(
      `tv/${seriesId}/season/${seasonNumber}?language=${this.language}`,
      { headers: this.headers }
    );
    if (!response?.episodes?.length) return [];
    return response.episodes.map((ep) => this.mapEpisode(ep));
  }

  private mapEpisode(response: TVSeasonEpisodeResponse): Episode {
    return {
      id: response.id,
      name: response.name,
      overview: response.overview,
      episodeNumber: response.episode_number,
      stillPath: response.still_path
        ? `${movieDBBaseImageUrl}${response.still_path}`
        : "",
      voteAverage: response.vote_average,
      airDate: response.air_date ?? "",
    };
  }

  async getSeriesWatchProviders(seriesId: number): Promise<Provider[]> {
    const languageMap: Record<string, string> = {
      en: "US",
      "pt-BR": "BR",
    };
    const region = languageMap[this.language] || "US";
    const response = await this.httpClient.get<ProviderWrapperResponse>(
      `tv/${seriesId}/watch/providers`,
      { headers: this.headers }
    );
    if (!response?.results?.[region]) return [];
    return this.mapProvider(response.results[region]);
  }

  private mapProvider(response: ProviderResponse): Provider[] {
    const { flatrate = [], rent = [], buy = [] } = response;
    const sortedProviders = flatrate.concat(rent).concat(buy);
    const list: ProviderItem[] = [];
    for (const p of sortedProviders) {
      const existing = list.find((item) => {
        const [first] = item.provider_name.split(" ");
        return p.provider_name.startsWith(first);
      });
      if (!existing) list.push(p);
    }
    return list.map((item) => ({
      id: item.provider_id,
      link: response.link,
      image: `${movieDBBaseImageUrl}${item.logo_path}`,
    }));
  }
}
