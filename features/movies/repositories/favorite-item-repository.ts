import * as SQLite from "expo-sqlite";
import { FavoriteItem } from "../interfaces";

export interface IFavoriteItemRepository {
  addFavoriteItem(
    name: string,
    posterPath: string,
    favoriteId: number
  ): Promise<void>;
  getFavoriteItems(favoriteId: number): Promise<FavoriteItem[]>;
}

export class FavoriteItemRepository implements IFavoriteItemRepository {
  db?: SQLite.SQLiteDatabase;

  constructor() {
    SQLite.openDatabaseAsync("moviesDB").then((db) => {
      this.db = db;
      this.createFavoriteTable();
    });
  }

  private async createFavoriteTable() {
    await this.db?.execAsync(`
        CREATE TABLE IF NOT EXISTS favorite_item (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, posterPath TEXT NOT NULL, favoriteId INTEGER, FOREIGN KEY(favoriteId) REFERENCES favorites(id));`);
  }

  async addFavoriteItem(name: string, posterPath: string, favoriteId: number) {
    await this.db?.execAsync(
      `INSERT INTO favorite_item (name, description, favoriteId) VALUES ('${name}', '${posterPath}', ${favoriteId});`
    );
  }

  async addFavoriteItems(items: FavoriteItem[], favoriteId: number) {
    await this.db?.execAsync(
      items.reduce((acc, item) => {
        acc += `INSERT INTO favorite_item (name, description, favoriteId) VALUES ('${item.name}', '${item.posterPath}', ${favoriteId});`;
        return acc;
      }, "")
    );
  }

  async getFavoriteItems(favoriteId: number) {
    const allRows = await this.db?.getAllAsync<FavoriteItem>(
      `SELECT * FROM favorite_item WHERE favoriteId = ${favoriteId};`
    );

    if (allRows === undefined) return [];

    return allRows;
  }
}
