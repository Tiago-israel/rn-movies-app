import { HttpClient } from "@/libraries/http";
import { token, movieDBBaseUrl, movieDBBaseImageUrl } from "../constants";
import { useUserStore } from "../store";
import {
  Person,
  PersonMovieCredits,
  PersonMovieCreditsResponse,
  PersonResponse,
} from "../interfaces";
import { formatDate } from "../helpers";

export class PeopleService {
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

  async getPersonDetails(id: number): Promise<Person> {
    const response = await this.httpClient.get<PersonResponse>(
      `person/${id}?language=${this.language}`,
      {
        headers: this.headers,
      }
    );

    return {
      id: response.id,
      name: response.name,
      birthday: formatDate(response.birthday),
      biography: response.biography,
      popularity: response.popularity,
      deathday: response.deathday ? formatDate(response.deathday) : "",
      profilePath: response.profile_path
        ? `${movieDBBaseImageUrl}${response.profile_path}`
        : "",
    };
  }

  async getMovieCreditis(id: number): Promise<Array<string>> {
    const { cast = [], crew = [] } =
      await this.httpClient.get<PersonMovieCreditsResponse>(
        `person/${id}/movie_credits?language=${this.language}`,
        {
          headers: this.headers,
        }
      );

    return [...cast, ...crew].map(
      (item) => `${movieDBBaseImageUrl}${item.poster_path}`
    );
  }
}
