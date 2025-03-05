import { useLocalSearchParams, router } from "expo-router";
import { PersonDetailsView } from "@/features";

export default function MovieReview() {
  const { id } = useLocalSearchParams<{ id: string }>();

  console.log('----> person', id)

  function goBack() {
    router.back();
  }

  return <PersonDetailsView personId={Number(id)} goBack={goBack}/>;
}
