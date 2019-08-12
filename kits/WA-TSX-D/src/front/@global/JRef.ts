export class JRef<T = HTMLElement> extends Object{
  private itemSetter?:($:T) => void;
  public item:T;
  public items:Table<T>;

  constructor(hashFunction?:($:T) => number|string){
    super();
    if(hashFunction){
      this.itemSetter = $ => this.items[hashFunction($)] = $;
      this.items = {};
    }else{
      this.itemSetter = $ => this.item = $;
    }
  }
  hasOwnProperty(key:string):boolean{
    // NOTE React.RefObject를 모방하기 위함
    return key === "current" || super.hasOwnProperty(key);
  }
  public set current(value:T){
    // NOTE unmount되는 경우 추적할 수 없고 items에 남게 된다.
    value && this.itemSetter(value);
  }
}