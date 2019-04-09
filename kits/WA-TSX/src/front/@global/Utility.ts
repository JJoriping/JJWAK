/**
 * HTML 공통 속성 `className`의 값에 적합한 문자열을 반환한다.
 *
 * @param args 클래스 목록. 값이 falsy한 경우 결과에 반영되지 않는다.
 */
export function C(...args:any[]):string{
  return args.filter(Boolean).join(' ');
}