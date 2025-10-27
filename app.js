import express from "express";
const app = express();
export default app;

import morgan from "morgan";
import playlistsRouter from "#api/playlists";
import tracksRouter from "#api/tracks";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/playlists", playlistsRouter);
app.use("/tracks", tracksRouter);

app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      return res.status(400).send(err.message);
    case "23505":
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});
