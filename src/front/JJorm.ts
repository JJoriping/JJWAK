import React = require("react");

type ActionReceiverTable = {
  [key:string]: (data:any) => void
};
type ActionReceiverPolytable = {
  [key:string]: Array<(data:any) => void>
};

export default abstract class JJorm<P = {}, S = {}> extends React.Component<P, S>{
  private static ACTION_RECEIVER_POLYTABLE:ActionReceiverPolytable = {};

  public static trigger(type:string, data?:any):void{
    for(const action of (JJorm.ACTION_RECEIVER_POLYTABLE[type] || [])){
      action(data);
    }
  }

  protected readonly abstract ACTION_RECEIVER_TABLE:ActionReceiverTable;
  protected readonly $:S;

  componentWillMount():void{
    for(const k in this.ACTION_RECEIVER_TABLE){
      if(JJorm.ACTION_RECEIVER_POLYTABLE.hasOwnProperty(k)){
        JJorm.ACTION_RECEIVER_POLYTABLE[k].push(this.ACTION_RECEIVER_TABLE[k]);
      }else{
        JJorm.ACTION_RECEIVER_POLYTABLE[k] = [ this.ACTION_RECEIVER_TABLE[k] ];
      }
    }
  }
  componentWillUnmount():void{
    for(const k in this.ACTION_RECEIVER_TABLE){
      const list = JJorm.ACTION_RECEIVER_POLYTABLE[k];

      list.splice(list.indexOf(this.ACTION_RECEIVER_TABLE[k]));
    }
  }
}