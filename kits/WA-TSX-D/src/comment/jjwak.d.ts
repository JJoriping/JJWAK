declare namespace JJWAK{
  namespace Page{
    type Type = keyof JJWAK.Page.DataTable;
    type DataTable = {
      'Index': never
    };
    interface Props<T extends JJWAK.Page.Type>{
      locale:string;
      page:T;
      path:string;
      title:string;
      
      data:JJWAK.Page.DataTable[T];
      version:string;
    }
  }
  type ActionReceiverTable = Partial<{
    'example-action': Action
  }>;
  type Clothes = {
    /**
     * `--dev`
     * 
     * 개발 플래그 설정 여부.
     */
    'development'?: boolean,
    /**
     * `--query`
     * 
     * 데이터베이스 쿼리 출력 여부.
     */
    'queryLogging'?: boolean
  };
  type Settings = {
    'application': {},
    'cookie-age': number,
    'cookie-secret': string,
    'crypto-secret': string,
    'database': {
      'host': string,
      'port': number,
      'username': string,
      'password': string,
      'database': string,
      'connectTimeout': number,
      'maxQueryExecutionTime': number
    },
    'https': {
      'key': string,
      'cert': string
    },
    'language-support': Table<string>
    'port': number,
  };
}