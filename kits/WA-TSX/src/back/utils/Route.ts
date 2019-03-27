import Express = require("express");
import { PageBuilder } from "./ReactNest";

export default function(App:Express.Application):void{
  App.get("/", PageBuilder("Index"));
  App.use((req, res) => res.sendStatus(404));
}