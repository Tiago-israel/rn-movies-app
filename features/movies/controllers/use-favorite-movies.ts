import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../store";
import { DrawerRef } from "../components";

export function useFavoriteMovies() {
  const drawerRef = useRef<DrawerRef>();
  const favoriteMovies = useUserStore((state) => state.favoriteMovies);
  const favoriteItems = useUserStore((state) => state.favoriteItems);
  const setFavoriteItem = useUserStore((state) => state.setFavoriteItem);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  function subimtFavoriteItem() {
    setFavoriteItem({ name, description });
    drawerRef.current?.close();
    setName("");
    setDescription("");
  }

  useEffect(() => {
    console.log(favoriteItems);
  },[favoriteItems])

  return {
    drawerRef,
    name,
    description,
    favoriteMovies,
    favoriteItems,
    setName,
    setDescription,
    subimtFavoriteItem
  };
}
