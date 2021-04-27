export namespace Schema{
  export type Settings = {
    '$schema': "./settings.schema.json",
    'application': {
      'language-support': Table<string>
    },
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
    'language-support': Table<string>,
    'log': {
      'directory': string,
      'interval': number
    },
    'port': number,
  };
}