import TypeORM = require("typeorm");

@TypeORM.Entity({ name: "dds_achievements" })
export default class Example implements DB.Sessionizable<DB.Example>{
  @TypeORM.PrimaryColumn({ name: "ex_key", type: "int" })
  public key:number;
  @TypeORM.Column({ name: "ex_value", type: "text" })
  public value:string;

  sessionize():DB.Example{
    return {
      key: this.key,
      value: this.value
    };
  }
}