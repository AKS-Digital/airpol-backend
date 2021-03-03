import dotenv from "dotenv";
dotenv.config();

import mongoDB from "./db";
import { Redis } from "./helpers";
import server from "./server";

(async () => {
  mongoDB.connect();
  Redis.open();
  server();
})();

process.on("SIGINT", async () => {
  await mongoDB.close();
  Redis.close();
  process.exit(0);
});
