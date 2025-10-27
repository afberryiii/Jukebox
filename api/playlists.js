import express from "express";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylists,
  getPlaylistById,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";

router.get("/", async (req, res) => {
  const playlists = await getPlaylists();
  res.send(playlists);
});

router.post("/", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required");

  const { name, description } = req.body;
  if (!name || !description)
    return res.status(400).send("Name and description are required");

  const playlist = await createPlaylist(name, description);
  res.status(201).send(playlist);
});

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found");
  req.playlist = playlist;
  next();
});

router.get("/:id", async (req, res) => {
  res.send(req.playlist);
});

router.get("/:id/tracks", async (req, res) => {
  let id = req.params.id;
  id = Number(id);
  console.log("Before Function)");
  const tracks = await getTracksByPlaylistId(req.params.id);
  console.log(tracks);
  res.send(tracks);
});

router.post("/:id/tracks", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required");

  const { trackId } = req.body;
  if (!trackId) return res.status(400).send("Track ID is required");

  const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
  res.status(201).send(playlistTrack);
});
