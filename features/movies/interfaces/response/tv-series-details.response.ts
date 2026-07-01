export type TVSeriesDetailsResponse = {
    adult?: boolean;
    backdrop_path?: string;
    created_by?: Array<{
        id?: number;
        credit_id?: string;
        name?: string;
        gender?: number;
        profile_path?: string;
        original_name?: string;
    }>;
    episode_run_time?: number[];
    first_air_date?: string;
    genres?: Array<{
        id?: number;
        name?: string;
    }>;
    homepage?: string;
    id?: number;
    in_production?: boolean;
    languages?: string[];
    last_air_date?: string;
    name?: string;
    networks?: Array<{
        name?: string;
        id?: number;
        logo_path?: string;
        origin_country?: string;
    }>;
    number_of_episodes?: number;
    number_of_seasons?: number;
    origin_country?: string[];
    original_language?: string;
    original_name?: string;
    overview?: string;
    popularity?: number;
    poster_path?: string;
    production_companies?: Array<{
        id?: number;
        logo_path?: string;
        name?: string;
        origin_country?: string;
    }>;
    seasons?: Array<{
        air_date?: string;
        episode_count?: number;
        id?: number;
        name?: string;
        overview?: string;
        poster_path?: string;
        season_number?: number;
    }>;
    status?: string;
    tagline?: string;
    type?: string;
    vote_average?: number;
    vote_count?: number;
}