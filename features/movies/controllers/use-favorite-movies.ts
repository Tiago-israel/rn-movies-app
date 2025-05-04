import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../store";
import { DrawerRef } from "../components";
import { FavoriteService } from "../services";

const favoriteService = new FavoriteService();

export function useFavoriteMovies() {
  const drawerRef = useRef<DrawerRef>();
  const favoriteMovies = useUserStore((state) => state.favoriteMovies);
  const favoriteItems = useUserStore((state) => state.favoriteItems);
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
    favoriteItems,
    setName,
    setDescription,
    subimtFavoriteItem,
  };
}
