declare namespace DB{
  type PaginateOptions = {
    'skip': number,
    'take': number
  };
  interface Sessionizable<T>{
    /**
     * 정보를 클라이언트에서 다룰 수 있도록 가공해 반환한다.
     */
    sessionize():T;
  }

  interface Example{
    key:number;
    value:string;
  }
}