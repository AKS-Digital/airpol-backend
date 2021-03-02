import { app } from "./app";

app.listen(process.env.PORT, () => {
  console.log(
    `${process.env.APP_NAME} has started on port ${process.env.PORT}`
  );
});

export default () => app;
