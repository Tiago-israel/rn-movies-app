import { useRef, useState } from "react";
import { useUserStore } from "../store";
import { DrawerRef } from "../components";
import { FavoriteService } from "../services";

const favoriteService = new FavoriteService();

export function useFavoriteMovies() {
  const drawerRef = useRef<DrawerRef>();
  const favoriteMovies = useUserStore((state) => state.favoriteMovies);
  const favoriteSeries = useUserStore((state) => state.favoriteSeries);
  const favoriteRanking = useUserStore((state) => state.favoriteRanking);
  const favoriteItems = useUserStore((state) => state.favoriteItems);
  const setFavoriteRanking = useUserStore((state) => state.setFavoriteRanking);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  function subimtFavoriteItem() {
    drawerRef.current?.close();
    setName("");
    setDescription("");
    favoriteService.addFavorite(name, description);
  }

  return {
    drawerRef,
    name,
    description,
    favoriteMovies,
    favoriteSeries,
    favoriteRanking,
    favoriteItems,
    setName,
    setDescription,
    setFavoriteRanking,
    subimtFavoriteItem,
  };
}
