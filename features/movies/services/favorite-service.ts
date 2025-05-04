import {
  FavoriteItemRepository,
  FavoriteRepository,
  IFavoriteRepository,
  IFavoriteItemRepository,
} from "../repositories";

export class FavoriteService {
  favoriteRepository: IFavoriteRepository;
  favoriteItemRepository: IFavoriteItemRepository;

  constructor() {
    this.favoriteRepository = new FavoriteRepository();
    this.favoriteItemRepository = new FavoriteItemRepository();
  }

  async addFavorite(name: string, description: string) {
    await this.favoriteRepository.addFavorite(name, description);
  }

  async getFavorites() {
    return await this.favoriteRepository.getFavorites();
  }

  async getFavoriteItems(favoriteId: number) {
    return await this.favoriteItemRepository.getFavoriteItems(favoriteId);
  }
}
