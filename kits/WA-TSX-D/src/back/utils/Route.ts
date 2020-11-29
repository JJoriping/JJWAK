import Express from "express";

import { loadLanguages } from "./Language";
import { PageBuilder } from "./ReactNest";

export default function(App:Express.Application):void{
  App.get("/", PageBuilder("Index"));
  App.get("/admin/load-languages", (req, res) => {
    loadLanguages();
    res.sendStatus(200);
  });
  App.use((req, res) => res.sendStatus(404));
}