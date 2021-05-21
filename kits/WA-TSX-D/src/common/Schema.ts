export namespace Schema{
  export type Settings = {
    '$schema': "./settings.schema.json",
    'application': {},
    'cookie': {
      'age': number,
      'secret': string
    },
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
    'languageSupport': Table<string>,
    'log': {
      'directory': string,
      'interval': number
    },
    'port': number,
  };
}