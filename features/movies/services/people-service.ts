import { HttpClient } from "@/libraries/http";
import { token, movieDBBaseUrl, movieDBBaseImageUrl } from "../constants";
import { useUserStore } from "../store";
import {
  ExternalIdsResponse,
  MediaItem,
  Person,
  PersonMovieCredits,
  PersonMovieCreditsResponse,
  PersonResponse,
  SocialMedia,
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

  async getMovieCreditis(
    id: number
  ): Promise<Array<{ id: number; backdropPath: string }>> {
    const { cast = [], crew = [] } =
      await this.httpClient.get<PersonMovieCreditsResponse>(
        `person/${id}/movie_credits?language=${this.language}`,
        {
          headers: this.headers,
        }
      );

    return [...cast, ...crew].map((item) => ({
      id: item.id,
      backdropPath: `${movieDBBaseImageUrl}${item.poster_path}`,
    }));
  }

  async getExternalIds(
    id: number
  ): Promise<MediaItem[]> {
    const response = await this.httpClient.get<ExternalIdsResponse>(
      `person/${id}/external_ids?language=${this.language}`,
      {
        headers: this.headers,
      }
    );

    const socialMedia: SocialMedia = {
      id: response.id,
      youtubeId: response.youtube_id
        ? `https://youtube.com/${response.youtube_id}`
        : undefined,
      tiktokId: response.tiktok_id
        ? `https://tiktok.com/@${response.tiktok_id}`
        : undefined,
      facebookId: response.facebook_id
        ? `https://facebook.com/${response.facebook_id}`
        : undefined,
      instagramId: response.instagram_id
        ? `https://instagram.com/${response.instagram_id}`
        : undefined,
      twitterId: response.twitter_id
        ? `https://x.com/${response.twitter_id}`
        : undefined,
    };

    return [
      { media: "youtube", path: socialMedia.youtubeId },
      { media: "tiktok", path: socialMedia.tiktokId },
      { media: "facebook", path: socialMedia.facebookId },
      { media: "instagram", path: socialMedia.instagramId },
      { media: "twitter", path: socialMedia.twitterId },
    ].filter((item) => item.path !== undefined);
  }
}
