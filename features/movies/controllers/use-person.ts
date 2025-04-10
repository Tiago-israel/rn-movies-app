import { useEffect, useRef, useState } from "react";
import { MediaItem, type Person } from "../interfaces";
import { PeopleService } from "../services";

export function usePerson(id: number) {
  const moviesService = useRef(new PeopleService());
  const [person, setPerson] = useState<Person>();
  const [movies, setMovies] = useState<any[]>([]);
  const [externalMedias, setExternalMedias] = useState<MediaItem[]>([]);

  async function getPerson(id: number) {
    const personDetails = await moviesService.current.getPersonDetails(id);
    setPerson(personDetails);
  }

  async function getMovieCredits(id: number) {
    const movieCredits = await moviesService.current.getMovieCreditis(id);
    setMovies(movieCredits);
  }

  async function getPersonExternalMedias(id: number) {
    const externalMedias = await moviesService.current.getExternalIds(id);
    setExternalMedias(externalMedias);
  }

  useEffect(() => {
    getPerson(id);
    getMovieCredits(id);
    getPersonExternalMedias(id);
  }, [id]);

  return { person, movies, externalMedias };
}
