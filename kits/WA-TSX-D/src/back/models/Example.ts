import * as TypeORM from "typeorm";

import { Database } from "common/Database";

@TypeORM.Entity({ name: "dds_achievements" })
export default class Example implements Database.Sessionizable<Database.Example>{
  @TypeORM.PrimaryColumn({ name: "ex_key", type: "int" })
  public key!:number;
  @TypeORM.Column({ name: "ex_value", type: "text" })
  public value!:string;

  sessionize():Database.Example{
    return {
      key: this.key,
      value: this.value
    };
  }
}