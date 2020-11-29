/**
 * `ACTION_RECEIVER_TABLE`에서 정의하는 핸들러 함수의 자료형.
 */
declare type Action<T extends any[] = []> = (...args:T) => (boolean|void);
/**
 * 주어진 함수의 매개 변수의 자료형.
 */
declare type ArgumentsOf<T> = T extends (...args:infer Arguments) => any ? Arguments : never;
/**
 * 딕셔너리의 자료형.
 *
 * 식별자의 자료형은 문자열로 취급한다.
 */
declare type Table<V> = {
  [key:string]: V
};