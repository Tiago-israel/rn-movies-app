import * as SQLite from "expo-sqlite";
import { Favorite } from "../interfaces";

export interface IFavoriteRepository {
  addFavorite(name: string, description: string): Promise<void>;
  getFavorites(): Promise<Favorite[]>;
}

export class FavoriteRepository implements IFavoriteRepository {
  db?: SQLite.SQLiteDatabase;

  constructor() {
    SQLite.openDatabaseAsync("moviesDB").then((db) => {
      this.db = db;
      this.createFavoriteTable();
    });
  }

  private async createFavoriteTable() {
    await this.db?.execAsync(`
        CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT);`);
  }

  async addFavorite(name: string, description: string) {
    await this.db?.execAsync(
      `INSERT INTO favorites (name, description) VALUES ('${name}', '${description}');`
    );
  }

  async getFavorites() {
    const allRows = await this.db?.getAllAsync<Favorite>(
      `SELECT * FROM favorites;`
    );

    if (allRows === undefined) return [];

    return allRows;
  }
}
