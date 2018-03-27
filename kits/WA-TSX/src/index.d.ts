declare type Table<V> = {
  [key:string]: V
};
declare namespace JJWAK{
  namespace Page{
    interface Props{
      page:string;
      title:string;
      locale:string;
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