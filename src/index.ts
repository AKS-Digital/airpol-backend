import dotenv from "dotenv";
dotenv.config();

import mongoDB from "./db";
import server from "./server";

(async () => {
  mongoDB.connect();
  server();
})();

process.on("SIGINT", async () => {
  await mongoDB.close();
  process.exit(0);
});
