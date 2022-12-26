import Express from "express";

export const raw = Express.raw({ limit: "100MB" });
export const send404: Express.RequestHandler = (req, res) => {
  res.sendStatus(404);
};
