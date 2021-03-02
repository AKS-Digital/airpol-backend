import mongoose from "mongoose";

const config = {
  prod: {
    url: process.env.MONGODB_URI,
    dbName: process.env.APP_NAME,
  },
  dev: {
    url: process.env.MONGODB_URI_DEV,
    dbName: process.env.APP_NAME + "-dev",
  },
  test: {
    url: process.env.MONGODB_URI_DEV,
    dbName: process.env.APP_NAME + "-test",
  },
};

// @ts-ignore
const { url, dbName } = config[process.env.NODE_ENV ?? "dev"];

const connect = async () => {
  await mongoose.connect(url.toString(), {
    dbName,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};

const close = async () => {
  await mongoose.connection.close();
};

const dropDatabase = async () => {
  const status = await mongoose.connection.db.dropDatabase();
  console.log("Database droped :", status);
};

mongoose.connection.on("connected", () =>
  console.log(`${dbName} mongoose connection is opened at ${url}`)
);

mongoose.connection.on("error", (err) =>
  console.log("Mongoose connection ERROR : ", err.message)
);

mongoose.connection.on("disconnected", () =>
  console.log("Mongoose connection is closed")
);

export default { connect, close, dropDatabase };
