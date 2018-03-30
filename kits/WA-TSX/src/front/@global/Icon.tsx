import React = require("react");

const FA_REGULAR_TESTER = /^(.+)-o$/;
const FA_CYCLE_TYPES:Table<string> = {
  '!': "fa-pulse",
  '@': "fa-spin"
};

export const Icon = (props:{ 'name': string }) => {
  const classList:string[] = [];
  const spinType = FA_CYCLE_TYPES[props.name[0]];
  let name:string = props.name;
  let regParser:RegExpMatchArray;

  if(spinType){
    classList.push(spinType);
    name = name.slice(1);
  }
  classList.push(...((regParser = name.match(FA_REGULAR_TESTER))
    ? ["far", `fa-${regParser[1]}`]
    : ["fas", `fa-${name}`]
  ));
  return <i className={classList.join(' ')} />;
};