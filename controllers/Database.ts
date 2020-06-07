import { Database } from "https://deno.land/x/denodb/mod.ts";

import { User } from "./models/index.ts";

export class DatabaseController {
  client: Database;

  /**
   * Inicializar cliente de base de datos
   */
  constructor() {
    this.client = new Database("sqlite3", {
      filepath: Deno.realPathSync("./controllers/database/db.sqlite"),
    });
  }

  /**
   * Inicializar modelos
   */
  initModels() {
    this.client.link([User]);
    return this.client.sync({ drop: true });
  }
}
