export default class L{
  private static readonly TABLE = (window as any)['__LANGUAGE'];

  public static get(key:string):string{
    return L.TABLE[key] || `(L#${key})`;
  }
}
delete (window as any)['__LANGUAGE'];