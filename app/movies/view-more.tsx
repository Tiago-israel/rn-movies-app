import { useLocalSearchParams, useRouter } from "expo-router";
import { ViewMoreView } from "@/features";
import { GenericItem, ServiceType } from "@/features/movies/interfaces";

export default function ViewMore() {
  const router = useRouter();
  const { type, title } = useLocalSearchParams();

  function goBack() {
    router.back();
  }

  function onPressItem(item: GenericItem) {
    const isMovie = (type as string)?.startsWith("movies.");
    if (isMovie) {
      router.push(`/movies/${item.id}`);
    } else {
      router.push(`/movies/series/${item.id}`);
    }
  }

  return (
    <ViewMoreView
      type={type as ServiceType}
      title={title as string}
      goBack={goBack}
      onPressItem={onPressItem}
    />
  );
}
