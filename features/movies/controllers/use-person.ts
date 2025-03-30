import { useEffect, useRef, useState } from "react";
import { type Person } from "../interfaces";
import { PeopleService } from "../services";

export function usePerson(id: number) {
  const moviesService = useRef(new PeopleService());
  const [person, setPerson] = useState<Person>();
  const [movies, setMovies] = useState<any[]>([]);

  async function getPerson(id: number) {
    const personDetails = await moviesService.current.getPersonDetails(id);
    setPerson(personDetails);
  }

  async function getMovieCredits(id: number) {
    const movieCredits = await moviesService.current.getMovieCreditis(id);
    setMovies(movieCredits);
  }

  useEffect(() => {
    getPerson(id);
    getMovieCredits(id);
  }, [id]);

  return { person, movies };
}
