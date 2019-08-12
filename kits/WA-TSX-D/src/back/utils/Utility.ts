/**
 * 프론트엔드 여부.
 */
export const FRONT:boolean = !Boolean("/*{APP['false-if-front']}*/");
/**
 * 배열을 생성해 반환한다.
 *
 * @param length 배열의 길이.
 * @param fill 배열의 내용.
 */
export function Iterator<T = undefined>(length:number, fill?:T):T[]{
  return Array(length).fill(fill);
}
/**
 * 배열을 주어진 함수에 따라 딕셔너리로 바꾸어 반환한다.
 *
 * @param target 대상 배열.
 * @param placer 값을 반환하는 함수.
 * @param keyPlacer 키를 반환하는 함수.
 */
export function reduceToTable<T, U, V extends number|string>(
  target:T[],
  placer:(v:T, i:number, my:T[]) => U,
  keyPlacer?:(v:T, i:number, my:T[]) => V
):{ [key in V]: U }{
  return target.reduce(keyPlacer
    ? (pv, v, i, my) => {
      pv[keyPlacer(v, i, my)] = placer(v, i, my);
      return pv;
    }
    : (pv, v, i, my) => {
      pv[String(v) as V] = placer(v, i, my);
      return pv;
    }
  , {} as { [key in V]: U });
}