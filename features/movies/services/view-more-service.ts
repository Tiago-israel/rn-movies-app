import { GenericItem, PaginatedResult, ServiceType } from "../interfaces";
import { MoviesService } from "./movies-service";
import { TVSeriesService } from "./tv-series-service";

export interface ViewMore {
  getPaginatedItems: (page: number) => Promise<PaginatedResult<GenericItem>>;
}

class ViewMoreFactory {
  private moviesService: MoviesService;
  private tvSeriesService: TVSeriesService;

  constructor(private type: ServiceType) {
    this.moviesService = new MoviesService();
    this.tvSeriesService = new TVSeriesService();
  }

  getService(): (page?: number) => Promise<PaginatedResult<GenericItem>> {
    switch (this.type) {
      case "movies.now_playing":
        return this.moviesService.getNowPlayingMovies;
      case "movies.top_rated":
        return this.moviesService.getTopRatedMovies;
      case "movies.popular":
        return this.moviesService.getPopularMovies;
      case "movies.upcoming":
        return this.moviesService.getUpcomingMovies;
      case "tv.airing_today":
        return this.tvSeriesService.getAiringToday;
      case "tv.on_the_air":
        return this.tvSeriesService.getOnTheAir;
      case "tv.popular":
        return this.tvSeriesService.getPopular;
      case "tv.top_rated":
        return this.tvSeriesService.getTopRated;
      default:
        throw new Error("Invalid service type");
    }
  }
}

export class ViewMoreService implements ViewMore {
  private service: (page?: number) => Promise<PaginatedResult<GenericItem>>;

  constructor(type: ServiceType) {
    this.service = new ViewMoreFactory(type).getService();
  }

  async getPaginatedItems(page: number): Promise<PaginatedResult<GenericItem>> {
    const result = await this.service?.(page);
    return result;
  }
}
