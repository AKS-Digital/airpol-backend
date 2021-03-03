import redis from "redis";

//Default Redis config
//localhost : 127.0.0.1 & port 6379
const client = redis.createClient({ port: 6379, host: "127.0.0.1" });

const open = () => {
  client.on("connect", () => {
    console.log("Attempt to connect to Redis Client...");
  });

  client.on("ready", () => {
    console.log("Redis client ready");
  });

  client.on("error", (err) => {
    console.log(err.message);
  });

  client.on("end", () => {
    console.log("Client disconnect from redis...");
  });
};

const close = () => {
  client.quit();
};

export const Redis = { open, close, client };
