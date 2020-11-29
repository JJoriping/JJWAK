import React from "react";

type ActionReceiverPolytable = {
  [key in keyof JJWAK.ActionReceiverTable]: Array<JJWAK.ActionReceiverTable[key]>
};
export default abstract class JJorm<P = {}, S = {}> extends React.PureComponent<P, S>{
  private static ACTION_RECEIVER_POLYTABLE:ActionReceiverPolytable = {};
  private static flushed = false;
  private static triggers:Function[] = [];

  public static flush():void{
    JJorm.flushed = true;
    for(const v of JJorm.triggers){
      v();
    }
  }
  public static trigger<
    T extends keyof JJWAK.ActionReceiverTable,
    A extends ArgumentsOf<JJWAK.ActionReceiverTable[T]>,
  >(
    type:T,
    ...args:A
  ):void{
    if(!JJorm.flushed){
      return void JJorm.triggers.push(() => JJorm.trigger(type, ...args));
    }
    const list = JJorm.ACTION_RECEIVER_POLYTABLE[type];

    if(!list){
      return
    }
    for(let i = list.length - 1; i >= 0; i--){
      if(list[i]!.apply(list[i], args) === false) break;
    }
  }

  protected readonly ACTION_RECEIVER_TABLE:JJWAK.ActionReceiverTable = {};

  componentDidMount():void{
    let k:keyof JJWAK.ActionReceiverTable;

    for(k in this.ACTION_RECEIVER_TABLE){
      if(JJorm.ACTION_RECEIVER_POLYTABLE.hasOwnProperty(k)){
        (JJorm.ACTION_RECEIVER_POLYTABLE[k] as any).push(this.ACTION_RECEIVER_TABLE[k]);
      }else{
        (JJorm.ACTION_RECEIVER_POLYTABLE[k] as any) = [ this.ACTION_RECEIVER_TABLE[k] ];
      }
    }
  }
  componentWillUnmount():void{
    let k:keyof JJWAK.ActionReceiverTable;

    for(k in this.ACTION_RECEIVER_TABLE){
      const list:any = JJorm.ACTION_RECEIVER_POLYTABLE[k];

      list.splice(list.lastIndexOf(this.ACTION_RECEIVER_TABLE[k]), 1);
    }
  }
}