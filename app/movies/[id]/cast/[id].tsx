import { useLocalSearchParams, router } from "expo-router";
import { CastView } from "@/features";

export default function Cast() {
  const { id } = useLocalSearchParams<{ id: string }>();

  function goBack() {
    router.back();
  }

  function goToPerson(personId: number) {
    router.navigate(`/movies/${id}/people/${personId}`);
  }

  return <CastView movieId={Number(id)} goBack={goBack} goToPerson={goToPerson} />;
}
