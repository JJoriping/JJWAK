import { JJWAK } from "common/JJWAK";
import { DateUnit } from "../enums/DateUnit";

/**
 * 클라이언트 설정 객체.
 */
export const CLIENT_SETTINGS: JJWAK.ClientSettings =
  "FRONT" in Object && eval("window.__CLIENT_SETTINGS");
/**
 * 프론트엔드 여부.
 */
export const FRONT: boolean = Boolean(CLIENT_SETTINGS);
/**
 * 유효한 단일 샤프 인자의 집합.
 */
export const REGEXP_LANGUAGE_ARGS = /\{#(\d+?)\}/g;
/**
 * 시간대 오프셋 값(㎳).
 */
export const TIMEZONE_OFFSET = new Date().getTimezoneOffset() * DateUnit.MINUTE;
/**
 * 제한 길이를 초과하는 내용이 생략된 문자열을 반환한다.
 *
 * @param text 대상 문자열.
 * @param limit 제한 길이.
 */
export function cut(text: string, limit: number): string {
  return text.length > limit ? text.slice(0, limit - 1) + "…" : text;
}
/**
 * 대상 객체에 합칠 객체들을 모두 합친 객체를 반환한다.
 *
 * 대상 객체는 복사되지 않고 직접 수정되며,
 * 합치려는 값이 객체인 경우 값을 덮어쓰지 않고 이 함수를 재귀적으로 호출한다.
 *
 * @param target 대상 객체.
 * @param args 합칠 객체 목록.
 */
export function merge(target: Table<any>, ...args: Table<any>[]): Table<any> {
  for (const v of args) {
    for (const [k, w] of Object.entries(v)) {
      if (
        typeof target[k] === "object" &&
        typeof w === "object" &&
        w !== null
      ) {
        merge(target[k], w);
      } else {
        target[k] = w;
      }
    }
  }
  return target;
}
/**
 * 대상 객체가 비어 있는지 확인해 반환한다.
 *
 * @param object 대상 객체.
 * @param includeNullity `true`인 경우 값이 `null`이나 `undefined`인 경우도 비어 있는 것으로 본다.
 */
export function isEmpty(object: Table<any>, includeNullity?: boolean): boolean {
  return (
    !object ||
    (includeNullity
      ? Object.keys(object).filter(
          (k) => object[k] !== null && object[k] !== undefined
        ).length === 0
      : Object.keys(object).length === 0)
  );
}
/**
 * 배열을 생성해 반환한다.
 *
 * @param length 배열의 길이.
 * @param fill 배열의 내용.
 */
export function Iterator<T = undefined>(length: number, fill?: T): T[] {
  return Array(length).fill(fill);
}
/**
 * 객체 배열을 정렬할 때 쓸 비교 함수를 만들어 반환한다.
 *
 * @param retriever 객체로부터 비굣값을 추출하는 함수.
 * @param desc 내림차순 정렬 여부.
 */
export function orderBy<T>(
  retriever: (v: T) => number,
  desc?: boolean
): (a: T, b: T) => number {
  return desc
    ? (b, a) => retriever(a) - retriever(b)
    : (a, b) => retriever(a) - retriever(b);
}
/**
 * 객체 배열을 문자열 기준으로 정렬할 때 쓸 비교 함수를 만들어 반환한다.
 *
 * @param retriever 객체로부터 비굣값을 추출하는 함수.
 * @param desc 내림차순 정렬 여부.
 */
export function orderByString<T>(
  retriever: (v: T) => string,
  desc?: boolean
): (a: T, b: T) => number {
  return desc
    ? (b, a) => retriever(a).localeCompare(retriever(b))
    : (a, b) => retriever(a).localeCompare(retriever(b));
}
/**
 * 대상 객체의 엔트리 일부만 갖는 객체를 반환한다.
 *
 * @param object 대상 객체.
 * @param keys 선택할 키.
 */
export function pick<T extends object, U extends keyof T>(
  object: T,
  ...keys: U[]
): Pick<T, U> {
  return keys.reduce<Pick<T, U>>((pv, v) => {
    if (v in object) {
      pv[v] = object[v];
    }
    return pv;
  }, {} as any);
}
/**
 * 배열을 주어진 함수에 따라 딕셔너리로 바꾸어 반환한다.
 *
 * @param target 대상 배열.
 * @param placer 값을 반환하는 함수.
 * @param keyPlacer 키를 반환하는 함수.
 */
export function reduceToTable<T, U, V extends number | string>(
  target: T[],
  placer: (v: T, i: number, my: T[]) => U,
  keyPlacer?: (v: T, i: number, my: T[]) => V
): { [key in V]: U } {
  return target.reduce(
    keyPlacer
      ? (pv, v, i, my) => {
          pv[keyPlacer(v, i, my)] = placer(v, i, my);
          return pv;
        }
      : (pv, v, i, my) => {
          pv[String(v) as V] = placer(v, i, my);
          return pv;
        },
    {} as { [key in V]: U }
  );
}
/**
 * 문자열 내 단일 샤프 인자들을 추가 정보로 대체시켜 반환한다.
 *
 * @param text 입력 문자열.
 * @param args 추가 정보.
 */
export function resolveLanguageArguments(text: string, ...args: any[]): string {
  return text.replace(REGEXP_LANGUAGE_ARGS, (_, v1) => args[v1]);
}
/**
 * 주어진 수가 0보다 크면 + 기호를 붙여 반환한다.
 *
 * @param value 대상.
 */
export function toSignedString(value: number): string {
  return (value > 0 ? "+" : "") + value;
}
