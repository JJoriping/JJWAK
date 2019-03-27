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
  type Settings = {
    'application': {},
    'cookie-age': number,
    'cookie-secret': string,
    'crypto-secret': string,
    'https': {
      'key': string,
      'cert': string
    },
    'language-support': Table<string>
    'port': number,
  };
}