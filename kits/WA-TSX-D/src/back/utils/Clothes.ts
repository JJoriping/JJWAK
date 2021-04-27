import { JJWAK } from "common/JJWAK";

function getBoolean(name:string):boolean{
  return process.argv.includes(name);
}
export const CLOTHES:JJWAK.Clothes = {
  development: getBoolean("--dev"),
  queryLogging: getBoolean("--query")
};