declare namespace JJWAK{
  namespace Page{
    type Type = keyof JJWAK.Page.DataTable;
    type DataTable = {
      'Index': never
    };
    type Metadata = {
      'titleArgs'?: string[]
    };
    interface Props<T extends JJWAK.Page.Type>{
      locale:string;
      page:T;
      path:string;
      title:string;
      
      data:JJWAK.Page.DataTable[T];
      version:string;

      metadata:JJWAK.Page.Metadata;
      ssr:boolean;
    }
  }
  type ActionReceiverTable = Partial<{
    'example-action': Action
  }>;
  type ClientSettings = Pick<Schema.Settings['application'],
    | 'language-support'
  >&{};
  type Clothes = {
    /**
     * `--dev`
     * 
     * 개발 플래그 설정 여부.
     */
    'development'?: boolean
  };
  type ScheduleOptions = {
    /**
     * `true`인 경우 시작할 때 한 번 즉시 호출한다.
     */
    'callAtStart': boolean,
    /**
     * `true`인 경우 정시에 호출된다. 가령 1시간마다 호출하려는 경우
     * 시작 시점과는 관계 없이 0시 정각, 1시 정각, …에 맞추어 호출된다.
     */
    'punctual': boolean
  };
}