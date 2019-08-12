import React = require("react");

// NOTE 백엔드에도 의존성이 있다.

const FA_REGULAR_TESTER = /^(.+)-o$/;
const FA_CYCLE_TYPES:Table<string> = {
  '!': "fa-pulse",
  '@': "fa-spin"
};

export enum IconType{
  NORMAL,
  STACK,
  PURE
}
type Props = {
  'className'?: string,
  'name': string,
  'type'?: IconType
};
export const Icon = ({ className, name, type }:Props) => {
  const classList:string[] = [ "icon" ];
  const style:React.CSSProperties = {};
  let chunk:RegExpMatchArray;

  if(className){
    classList.push(className);
  }
  switch(type){
    default:
    case IconType.NORMAL:{
      const spinType = FA_CYCLE_TYPES[name[0]];

      classList.push("fa-fw");
      if(spinType){
        classList.push(spinType);
        name = name.slice(1);
      }
      chunk = name.match(FA_REGULAR_TESTER);
      classList.push(...(chunk
        ? [ "far", `fa-${chunk[1]}` ]
        : [ "fas", `fa-${name}` ]
      ));
      return <i className={classList.join(' ')} style={style} />;
    }
    case IconType.STACK:
      classList.push("fa-stack");
      return <span className="ik fa-stack">
        {name.split(',').map((v, i) => <Icon key={i} className="fa-stack-1x" name={v} />)}
      </span>;
    case IconType.PURE:
      classList.push("ip", `icon-${name}`);
      style.backgroundImage = `url("/media/images/icons/${name}.png")`;
      return <i className={classList.join(' ')} style={style} />;
  }
};