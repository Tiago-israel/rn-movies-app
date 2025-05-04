import { useLocalSearchParams, useRouter } from "expo-router";
import { ViewMoreView } from "@/features";
import { ServiceType } from "@/features/movies/interfaces";

export default function ViewMore() {
  const router = useRouter();
  const { type, title } = useLocalSearchParams();

  function goBack() {
    router.back();
  }

  return (
    <ViewMoreView
      type={type as ServiceType}
      title={title as string}
      goBack={goBack}
    />
  );
}
