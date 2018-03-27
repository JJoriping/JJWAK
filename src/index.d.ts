declare type Table<V> = {
  [key:string]: V
};
declare namespace DDS{
  namespace Page{
    type Name = "Index";
    interface Props{
      'page': DDS.Page.Name
    }
  }
  type Settings = {
    'port': number,
    'https': {
      'key': string,
      'cert': string
    },
    'cookie-secret': string,
    'language-support': string[]
  };
}