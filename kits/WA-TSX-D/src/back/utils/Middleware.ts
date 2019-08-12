import Express = require("express");
import BodyParser = require("body-parser");

export const raw = BodyParser.raw({ limit: "100MB" });
export const send404:Express.RequestHandler = (req, res) => {
  res.sendStatus(404);
};