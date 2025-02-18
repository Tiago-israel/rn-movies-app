type ImageProps = {
  width: number;
  height: number;
  vote_count: number;
  vote_average: number;
  aspect_ratio: number;
  file_path: string;
  iso_639_1: any;
};

export type ImageResponse = {
  id: number;
  logos: Array<ImageProps>;
  backdrops: Array<ImageProps>;
  posters: Array<ImageProps>;
};
