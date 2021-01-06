import * as TypeORM from "typeorm";

import { ValueTransformer } from "typeorm/decorator/options/ValueTransformer";

import DB from "./Database";

export function Transaction():MethodDecorator{
  return (target, propKey, descriptor) => {
    if(!(descriptor.value instanceof Function)) return;
    const original = descriptor.value;

    descriptor.value = function(this:any, ...args:any[]){
      const self = this;
      const tip = args.length - 1;

      if(args[tip] instanceof TypeORM.EntityManager){
        return original.call(self, ...args);
      }else{
        return DB.Manager.transaction(manager => {
          if(args[tip] === undefined){
            args[tip] = manager;
          }
          return original.call(self, ...args, manager);
        });
      }
    } as any;
  };
}
export class Transformer{
  private static PARSER_POINT_FROM = /^POINT\((\S+) (\S+)\)$/;

  public static Boolean:ValueTransformer = {
    from: (v:number) => Boolean(v),
    to: (v:Boolean) => v ? 1 : 0
  };
  public static List:ValueTransformer = {
    from: (v:string) => v ? v.split(',') : [],
    to: (v:string[]) => v.join(',')
  };
  public static Point:ValueTransformer = {
    from: (v:string) => {
      return v.match(Transformer.PARSER_POINT_FROM)!.slice(1).map(Number);
    },
    to: (v:number[]) => {
      return v && `POINT(${v[0]} ${v[1]})`;
    }
  };
}