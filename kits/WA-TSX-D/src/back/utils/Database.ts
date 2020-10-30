import TypeORM = require("typeorm");

import { SETTINGS } from "./System";
import { CLOTHES } from "./Clothes";
import { Iterator } from "./Utility";

//@jjwak-auto DB_IMPORT {
import Example from "back/models/Example";
//@jjwak-auto DB_IMPORT }
import { Logger } from "./Logger";

export default class DB{
  private static agent:TypeORM.Connection;

  public static get Manager():TypeORM.EntityManager{
    return DB.agent.manager;
  }
  public static async initialize():Promise<void>{
    const entities:Function[] = [
      //@jjwak-auto DB_ENTITY {
      Example
      //@jjwak-auto DB_ENTITY }
    ];

    DB.agent = await TypeORM.createConnection({
      type: "mysql",
      supportBigNumbers: true,
      bigNumberStrings: false,
      ...SETTINGS['database'],
      logging: CLOTHES.queryLogging ? [ "query" ] : [],
      entities
    });
    Logger.success("DB").put(SETTINGS['database'].host).out();
  }
  public static paginate(length:number, page:number):DB.PaginateOptions{
    return {
      skip: length * page,
      take: length
    };
  }
  public static getTable(Target:new() => any):TypeORM.EntityMetadata{
    return DB.Manager.connection.getMetadata(Target);
  }
  public static getColumnName(table:TypeORM.EntityMetadata, column:string):string{
    return table.findColumnWithPropertyName(column).databaseName;
  }
  public static callProcedure(manager:TypeORM.EntityManager, name:string, ...args:any[]):Promise<void>{
    return manager.query(`CALL dds_p_${name}(${Iterator(args.length, "?").join(',')})`, args);
  }
  public static coalesce<T extends { 'id': any }, U extends keyof T>(
    manager:TypeORM.EntityManager,
    Target:new() => T,
    targetId:T['id'],
    column:U&string,
    data:Partial<T[U]>
  ):Promise<void>{
    if(manager === null) manager = DB.Manager;
    const table = DB.getTable(Target);
    const dataText = JSON.stringify(data);

    return manager.query(`UPDATE ${table.tableName}
      SET ${DB.getColumnName(table, column)} = COALESCE(JSON_MERGE_PATCH(${DB.getColumnName(table, column)}, ?), ?)
      WHERE ${DB.getColumnName(table, 'id')} = ?
    `, [
      dataText, dataText,
      targetId
    ]);
  }
  public static async count<T>(Model:new() => T, conditions?:TypeORM.FindConditions<T>):Promise<number>{
    // NOTE .count() 함수는 내부적으로 DISTINCT PK를 쓰고 있어 느리다.
    return (await DB.Manager.createQueryBuilder(Model, "model")
      .select("COUNT(*) AS count")
      .where(conditions)
      .getRawOne()
    )['count'];
  }
}